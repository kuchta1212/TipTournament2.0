namespace TipTournament2._0.Tests.Calculator
{
    using System.Collections.Generic;
    using System.Linq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Models;
    using Xunit;

    public class DixitBonusCalculatorTests
    {
        [Fact]
        public void ApplyDixitBonus_NoBets_DoesNotThrow()
        {
            DixitBonusCalculator.ApplyDixitBonus(new List<MatchBet>());
            DixitBonusCalculator.ApplyDixitBonus((List<MatchBet>)null);
        }

        [Fact]
        public void ApplyDixitBonus_AllWrong_AllBonusZero()
        {
            var bets = Enumerable.Range(0, 5)
                .Select(_ => new MatchBet { Result = BetResult.NOTHING })
                .ToList();

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void ApplyDixitBonus_50PercentCorrect_NoBonus()
        {
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.WINNER },
                new MatchBet { Result = BetResult.NOTHING },
                new MatchBet { Result = BetResult.NOTHING },
                new MatchBet { Result = BetResult.NOTHING },
                new MatchBet { Result = BetResult.NOTHING },
                new MatchBet { Result = BetResult.NOTHING },
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void ApplyDixitBonus_39PercentCorrect_Plus1()
        {
            // 39 out of 100 = 39%
            var bets = new List<MatchBet>();
            for (int i = 0; i < 39; i++)
                bets.Add(new MatchBet { Result = BetResult.WINNER });
            for (int i = 0; i < 61; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(1, b.DixitBonus));
            Assert.All(bets.Where(b => b.Result == BetResult.NOTHING), b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void ApplyDixitBonus_19PercentCorrect_Plus2()
        {
            // 19 out of 100 = 19%
            var bets = new List<MatchBet>();
            for (int i = 0; i < 19; i++)
                bets.Add(new MatchBet { Result = BetResult.SCORE });
            for (int i = 0; i < 81; i++)
                bets.Add(new MatchBet { Result = BetResult.NOTHING });

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets.Where(b => b.Result != BetResult.NOTHING), b => Assert.Equal(2, b.DixitBonus));
        }

        [Fact]
        public void ApplyDixitBonus_1CorrectOutOfMany_Plus3()
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
        public void ApplyDixitBonus_1BetTotal_Correct_Plus3()
        {
            var bets = new List<MatchBet>
            {
                new MatchBet { Result = BetResult.WINNER }
            };

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.Equal(3, bets[0].DixitBonus);
        }

        // Delta bet tests

        [Fact]
        public void ApplyDixitBonus_DeltaBets_NoBets_DoesNotThrow()
        {
            DixitBonusCalculator.ApplyDixitBonus(new List<DeltaBet>());
            DixitBonusCalculator.ApplyDixitBonus((List<DeltaBet>)null);
        }

        [Fact]
        public void ApplyDixitBonus_DeltaBets_AllWrong_AllBonusZero()
        {
            var bets = Enumerable.Range(0, 5)
                .Select(_ => new DeltaBet { Result = new DeltaBetResult { Points = 0 } })
                .ToList();

            DixitBonusCalculator.ApplyDixitBonus(bets);

            Assert.All(bets, b => Assert.Equal(0, b.DixitBonus));
        }

        [Fact]
        public void ApplyDixitBonus_DeltaBets_1CorrectOutOfMany_Plus3()
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
        public void ApplyDixitBonus_DeltaBets_39PercentCorrect_Plus1()
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
        public void ApplyDixitBonus_DeltaBets_NullResult_TreatedAsWrong()
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
    }
}
