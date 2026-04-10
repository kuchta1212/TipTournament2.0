namespace TipTournament2._0.Tests.Calculator
{
    using System.Collections.Generic;
    using System.Linq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Models;
    using Xunit;

    public class DixitBonusCalculatorTests
    {
        // =============================================
        // MatchBet tests
        // =============================================

        [Fact]
        public void MatchBet_NoBets_DoesNotThrow()
        {
            DixitBonusCalculator.ApplyDixitBonus(new List<MatchBet>());
            DixitBonusCalculator.ApplyDixitBonus((List<MatchBet>)null);
        }

        [Fact]
        public void MatchBet_AllWrong_AllBonusZero()
        {
            var bets = Enumerable.Range(0, 5)
                .Select(_ => new MatchBet { Result = BetResult.NOTHING })
                .ToList();

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_AllCorrect_NoBonus()
        {
            // 100% correct → no bonus for anyone
            var bets = Enumerable.Range(0, 10)
                .Select(_ => new MatchBet { Result = BetResult.WINNER })
                .ToList();

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_50PercentCorrect_NoBonus()
        {
            var bets = new List<MatchBet>();
            for (int i = 0; i < 5; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 5; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        // ---- Boundary: exactly 40% ----

        [Fact]
        public void MatchBet_Exactly40Percent_NoBonus()
        {
            // 4/10 = 0.40, NOT < 0.40 → 0 bonus
            var bets = new List<MatchBet>();
            for (int i = 0; i < 4; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 6; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_JustBelow40Percent_Plus1()
        {
            // 3/10 = 0.30 < 0.40 → +1 bonus
            var bets = new List<MatchBet>();
            for (int i = 0; i < 3; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 7; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(1, b.DixitBonus));
            Assert.All(bets.Where(b => b.Result == BetResult.NOTHING), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_39of100_Plus1()
        {
            // 39/100 = 0.39 < 0.40 → +1
            var bets = new List<MatchBet>();
            for (int i = 0; i < 39; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 61; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(1, b.DixitBonus));
            Assert.All(bets.Where(b => b.Result == BetResult.NOTHING), b => Assert.Equal(0, b.DixitBonus));
        }

        // ---- Boundary: exactly 20% ----

        [Fact]
        public void MatchBet_Exactly20Percent_Plus1_Not_Plus2()
        {
            // 2/10 = 0.20, NOT < 0.20 → falls to < 0.40 check → +1
            var bets = new List<MatchBet>();
            for (int i = 0; i < 2; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 8; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(1, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_JustBelow20Percent_Plus2()
        {
            // 1/10 = 0.10 < 0.20, but correctCount == 1 → +3 (only-you takes priority)
            // Use 2/11 = 0.1818 < 0.20 → +2
            var bets = new List<MatchBet>();
            for (int i = 0; i < 2; i++)
                bets.Add(new MatchBet { Result = BetResult.SCORE });
            for (int i = 0; i < 9; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(2, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_19of100_Plus2()
        {
            // 19/100 = 0.19 < 0.20 → +2
            var bets = new List<MatchBet>();
            for (int i = 0; i < 19; i++)
                bets.Add(new MatchBet { Result = BetResult.SCORE });
            for (int i = 0; i < 81; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(2, b.DixitBonus));
        }

        // ---- "Only you" tier ----

        [Fact]
        public void MatchBet_1CorrectOutOfMany_Plus3()
        {
            var bets = new List<MatchBet>();
            bets.Add(new MatchBet { Result = BetResult.DIFFERENCE });
            for (int i = 0; i < 9; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
            Assert.All(bets.Skip(1), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_1BetTotal_Correct_Plus3()
        {
            // Edge case: only 1 person bet, and they're correct → +3
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.WINNER }
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
        }

        [Fact]
        public void MatchBet_1CorrectOf2Total_Plus3_OnlyYouOverridesRatio()
        {
            // 1/2 = 50% by ratio → would be 0, but "only you" rule gives +3
            // This is intentional: the "only you" tier always takes priority
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.NOTHING },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
            Assert.Equal(0, bets[1].DixitBonus);
        }

        [Fact]
        public void MatchBet_1CorrectOf3Total_Plus3_OnlyYouOverridesRatio()
        {
            // 1/3 = 33% → ratio would give +1, but "only you" gives +3
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.SCORE },
                new MatchBet { Result = BetResult.NOTHING },
                new MatchBet { Result = BetResult.NOTHING },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
        }

        // ---- 2 correct: should NOT trigger "only you" ----

        [Fact]
        public void MatchBet_2CorrectOf6_Plus1_NotPlus3()
        {
            // 2/6 = 33.3% < 40% → +1, must NOT be +3
            var bets = new List<MatchBet>();
            for (int i = 0; i < 2; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 4; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(1, b.DixitBonus));
        }

        [Fact]
        public void MatchBet_2CorrectOf20_Plus2()
        {
            // 2/20 = 10% < 20% → +2
            var bets = new List<MatchBet>();
            for (int i = 0; i < 2; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 18; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(2, b.DixitBonus));
        }

        // ---- Mixed BetResult types all count as "correct" ----

        [Fact]
        public void MatchBet_MixedCorrectTypes_AllGetSameBonus()
        {
            // WINNER(1), DIFFERENCE(2), SCORE(4) all count as correct
            // 3/10 = 30% < 40% → +1 for all correct bets
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.DIFFERENCE },
                new MatchBet { Result = BetResult.SCORE },
            };
            for (int i = 0; i < 7; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(1, bets[0].DixitBonus); // WINNER
            Assert.Equal(1, bets[1].DixitBonus); // DIFFERENCE
            Assert.Equal(1, bets[2].DixitBonus); // SCORE
        }

        // ---- Idempotency: calling twice should not accumulate ----

        [Fact]
        public void MatchBet_CalledTwice_DoesNotAccumulate()
        {
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.NOTHING },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);
            DixitBonusCalculator.ApplyDixitBonus(bets);

            // Should still be 3, not 6
            Assert.Equal(3, bets[0].DixitBonus);
            Assert.Equal(0, bets[1].DixitBonus);
        }

        // ---- Wrong bets always get 0, even if pre-set ----

        [Fact]
        public void MatchBet_WrongBetWithPreExistingBonus_ResetsToZero()
        {
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.NOTHING, DixitBonus = 5 },
                new MatchBet { Result = BetResult.WINNER },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(0, bets[0].DixitBonus);  // must reset to 0
            Assert.Equal(3, bets[1].DixitBonus);
        }

        // =============================================
        // DeltaBet tests
        // =============================================

        [Fact]
        public void DeltaBet_NoBets_DoesNotThrow()
        {
            DixitBonusCalculator.ApplyDixitBonus(new List<DeltaBet>());
            DixitBonusCalculator.ApplyDixitBonus((List<DeltaBet>)null);
        }

        [Fact]
        public void DeltaBet_AllWrong_AllBonusZero()
        {
            var bets = Enumerable.Range(0, 5)
                .Select(_ => new DeltaBet { Result = new DeltaBetResult { Points = 0 } })
                .ToList();

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void DeltaBet_AllCorrect_NoBonus()
        {
            var bets = Enumerable.Range(0, 10)
                .Select(_ => new DeltaBet { Result = new DeltaBetResult { Points = 2 } })
                .ToList();

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void DeltaBet_1CorrectOutOfMany_Plus3()
        {
            var bets = new List<DeltaBet>();
            bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 2 } });
            for (int i = 0; i < 9; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
            Assert.All(bets.Skip(1), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void DeltaBet_Exactly40Percent_NoBonus()
        {
            // 4/10 = 0.40, NOT < 0.40 → 0
            var bets = new List<DeltaBet>();
            for (int i = 0; i < 4; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 2 } });
            for (int i = 0; i < 6; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result.Points > 0), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void DeltaBet_Exactly20Percent_Plus1_Not_Plus2()
        {
            // 2/10 = 0.20, NOT < 0.20 → falls to < 0.40 → +1
            var bets = new List<DeltaBet>();
            for (int i = 0; i < 2; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 4 } });
            for (int i = 0; i < 8; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result.Points > 0), b => Assert.Equal(1, b.DixitBonus));
        }

        [Fact]
        public void DeltaBet_39PercentCorrect_Plus1()
        {
            var bets = new List<DeltaBet>();
            for (int i = 0; i < 39; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 2 } });
            for (int i = 0; i < 61; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result.Points > 0), b => Assert.Equal(1, b.DixitBonus));
            Assert.All(bets.Where(b => b.Result.Points == 0), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void DeltaBet_NullResult_TreatedAsWrong()
        {
            var bets = new List<DeltaBet>
            {
                new DeltaBet { Result = new DeltaBetResult { Points = 2 } },
                new DeltaBet { Result = null },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
            Assert.Equal(0, bets[1].DixitBonus);
        }

        // ---- Delta: partial vs full correctness get same tier ----

        [Fact]
        public void DeltaBet_PartialAndFullCorrectness_SameTier()
        {
            // 1 bet with 2 pts (one team right), 1 bet with 4 pts (both teams right)
            // Both are "correct" → 2/10 = 20% → +1
            var bets = new List<DeltaBet>
            {
                new DeltaBet { Result = new DeltaBetResult { Points = 2 } },
                new DeltaBet { Result = new DeltaBetResult { Points = 4 } },
            };
            for (int i = 0; i < 8; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(1, bets[0].DixitBonus); // 2 pts
            Assert.Equal(1, bets[1].DixitBonus); // 4 pts — same bonus tier
        }

        // ---- Delta: idempotency ----

        [Fact]
        public void DeltaBet_CalledTwice_DoesNotAccumulate()
        {
            var bets = new List<DeltaBet>
            {
                new DeltaBet { Result = new DeltaBetResult { Points = 2 } },
                new DeltaBet { Result = new DeltaBetResult { Points = 0 } },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);
            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus); // still 3, not 6
        }

        // ---- Delta: wrong bet with pre-existing bonus resets ----

        [Fact]
        public void DeltaBet_WrongBetWithPreExistingBonus_ResetsToZero()
        {
            var bets = new List<DeltaBet>
            {
                new DeltaBet { Result = new DeltaBetResult { Points = 0 }, DixitBonus = 5 },
                new DeltaBet { Result = new DeltaBetResult { Points = 2 } },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(0, bets[0].DixitBonus);
            Assert.Equal(3, bets[1].DixitBonus);
        }

        // =============================================
        // Realistic tournament scenarios
        // =============================================

        [Fact]
        public void Scenario_TypicalGroupMatch_20Players_5Correct()
        {
            // 5/20 = 25% < 40% → +1 for each correct bet
            var bets = new List<MatchBet>();
            for (int i = 0; i < 5; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 15; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Take(5), b => Assert.Equal(1, b.DixitBonus));
            Assert.All(bets.Skip(5), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void Scenario_BigUpset_20Players_2Correct()
        {
            // 2/20 = 10% < 20% → +2
            var bets = new List<MatchBet>();
            for (int i = 0; i < 2; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 18; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Take(2), b => Assert.Equal(2, b.DixitBonus));
        }

        [Fact]
        public void Scenario_MassiveUpset_20Players_1Correct()
        {
            // 1/20 = 5%, but correctCount == 1 → +3
            var bets = new List<MatchBet>();
            bets.Add(new MatchBet { Result = BetResult.SCORE });
            for (int i = 0; i < 19; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
        }

        [Fact]
        public void Scenario_FavoriteWins_20Players_15Correct()
        {
            // 15/20 = 75% → no bonus
            var bets = new List<MatchBet>();
            for (int i = 0; i < 15; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 5; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void Scenario_KnockoutOutsider_15Players_1Correct()
        {
            // Delta: 1/15, correctCount == 1 → +3
            var bets = new List<DeltaBet>();
            bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 4 } });
            for (int i = 0; i < 14; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
        }

        [Fact]
        public void Scenario_KnockoutFavorite_15Players_10Correct()
        {
            // Delta: 10/15 = 66.7% → no bonus
            var bets = new List<DeltaBet>();
            for (int i = 0; i < 10; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 2 } });
            for (int i = 0; i < 5; i++)
                bets.Add(new DeltaBet { Result = new DeltaBetResult { Points = 0 } });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }
    }
}
