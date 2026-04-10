namespace TipTournament2._0.Tests.Coordinator
{
    using System.Collections.Generic;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using Xunit;
    using Match = TipTournament2._0.Models.Match;

    public class GroupMatchesResultCoordinatorTests
    {
        private readonly Mock<IMatchClient> mockMatchClient = new Mock<IMatchClient>();
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<IBetResultMaker> mockBetMaker = new Mock<IBetResultMaker>();

        [Fact]
        public void UploadNewResult_SavesResultAndUpdatesMatch()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1", Ended = false };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(new List<MatchBet>());
            this.mockBetMaker.Setup(b => b.UpdateBetResult(It.IsAny<List<MatchBet>>(), It.IsAny<Result>())).Returns(new List<MatchBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser>());

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.True(match.Ended);
            Assert.Equal(savedResult, match.Result);
            this.mockDb.Verify(d => d.UpdateMatch(match), Times.Once);
        }

        [Fact]
        public void UploadNewResult_CallsUpdateBetResult()
        {
            var result = new Result { HomeTeam = 1, AwayTeam = 0 };
            var savedResult = new Result { Id = "r1", HomeTeam = 1, AwayTeam = 0 };
            var match = new Match { Id = "m1" };
            var bets = new List<MatchBet> { new MatchBet() };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(match)).Returns(bets);
            this.mockBetMaker.Setup(b => b.UpdateBetResult(bets, savedResult)).Returns(bets);
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser>());

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            this.mockBetMaker.Verify(b => b.UpdateBetResult(bets, savedResult), Times.Once);
            this.mockDb.Verify(d => d.UpdateBets(bets), Times.Once);
        }

        [Fact]
        public void UploadNewResult_UserWithScoreBet_Gets4PointsAdded()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };
            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.SCORE };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(new List<MatchBet>());
            this.mockBetMaker.Setup(b => b.UpdateBetResult(It.IsAny<List<MatchBet>>(), It.IsAny<Result>())).Returns(new List<MatchBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(4, user.AlfaPoints);
            Assert.Equal(4, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_UserWithNoBet_Gets0Points()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };
            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(new List<MatchBet>());
            this.mockBetMaker.Setup(b => b.UpdateBetResult(It.IsAny<List<MatchBet>>(), It.IsAny<Result>())).Returns(new List<MatchBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns((MatchBet)null);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(0, user.AlfaPoints);
            Assert.Equal(0, user.TotalPoints);
        }

        [Fact]
        public void RecalculatePoints_IncludesDixitBonus()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };
            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.WINNER, DixitBonus = 2 };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(new List<MatchBet>());
            this.mockBetMaker.Setup(b => b.UpdateBetResult(It.IsAny<List<MatchBet>>(), It.IsAny<Result>())).Returns(new List<MatchBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(3, user.AlfaPoints);  // 1 (WINNER) + 2 (DixitBonus)
            Assert.Equal(3, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_WrongBet_DixitBonusIsZero_NoPointsAdded()
        {
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };
            var user = new ApplicationUser { Id = "u1", AlfaPoints = 0, TotalPoints = 0 };
            var bet = new MatchBet { Result = BetResult.NOTHING, DixitBonus = 0 };

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(new List<MatchBet>());
            this.mockBetMaker.Setup(b => b.UpdateBetResult(It.IsAny<List<MatchBet>>(), It.IsAny<Result>())).Returns(new List<MatchBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "u1")).Returns(bet);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            Assert.Equal(0, user.AlfaPoints);
            Assert.Equal(0, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_EndToEnd_DixitBonusComputedAndAppliedToPoints()
        {
            // Simulates the full pipeline: UpdateBetResult sets Results on bets,
            // then DixitBonusCalculator runs on those same bet objects,
            // then RecalculatePoints re-fetches bets (with DixitBonus now set) and adds to user points.
            var result = new Result { HomeTeam = 2, AwayTeam = 1 };
            var savedResult = new Result { Id = "r1", HomeTeam = 2, AwayTeam = 1 };
            var match = new Match { Id = "m1" };

            var userA = new ApplicationUser { Id = "uA", AlfaPoints = 10, TotalPoints = 20 };
            var userB = new ApplicationUser { Id = "uB", AlfaPoints = 5, TotalPoints = 15 };

            // These are the bets that UpdateBetsResult will work with.
            // BetResultMaker sets the Result field; DixitBonusCalculator then sets DixitBonus.
            var betA = new MatchBet { Result = BetResult.NOTHING }; // will remain NOTHING
            var betB = new MatchBet { Result = BetResult.NOTHING }; // will remain NOTHING
            var allBets = new List<MatchBet> { betA, betB };

            // BetResultMaker mock: simulates setting results. Only betB is correct.
            this.mockBetMaker.Setup(b => b.UpdateBetResult(allBets, savedResult))
                .Callback<List<MatchBet>, Result>((bets, r) =>
                {
                    bets[0].Result = BetResult.NOTHING;  // userA wrong
                    bets[1].Result = BetResult.WINNER;    // userB correct (only 1 correct of 2 → +3)
                })
                .Returns(allBets);

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(allBets);
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { userA, userB });

            // RecalculatePoints re-fetches bets from DB. We return the SAME objects
            // (simulating that DixitBonus was persisted by UpdateBets and then read back).
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "uA")).Returns(betA);
            this.mockDb.Setup(d => d.GetBetForMatchAndUser(match, "uB")).Returns(betB);

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // After UpdateBetsResult: betB.Result = WINNER, betB.DixitBonus = 3 (only 1 correct of 2)
            Assert.Equal(BetResult.NOTHING, betA.Result);
            Assert.Equal(0, betA.DixitBonus);
            Assert.Equal(BetResult.WINNER, betB.Result);
            Assert.Equal(3, betB.DixitBonus);

            // userA: no points added (wrong bet)
            Assert.Equal(10, userA.AlfaPoints);
            Assert.Equal(20, userA.TotalPoints);

            // userB: 1 (WINNER) + 3 (DixitBonus) = 4 added
            Assert.Equal(9, userB.AlfaPoints);   // 5 + 4
            Assert.Equal(19, userB.TotalPoints);  // 15 + 4
        }

        [Fact]
        public void UploadNewResult_EndToEnd_MultipleCorrect_NoDixitBonus()
        {
            // 8 out of 10 correct → 80% → no Dixit bonus
            var result = new Result { HomeTeam = 1, AwayTeam = 0 };
            var savedResult = new Result { Id = "r1", HomeTeam = 1, AwayTeam = 0 };
            var match = new Match { Id = "m1" };

            var allBets = new List<MatchBet>();
            for (int i = 0; i < 10; i++)
                allBets.Add(new MatchBet { Result = BetResult.NOTHING });

            this.mockBetMaker.Setup(b => b.UpdateBetResult(allBets, savedResult))
                .Callback<List<MatchBet>, Result>((bets, r) =>
                {
                    for (int i = 0; i < 8; i++) bets[i].Result = BetResult.WINNER;
                    // bets[8] and bets[9] stay NOTHING
                })
                .Returns(allBets);

            this.mockDb.Setup(d => d.SaveResult(result)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForMatch(It.IsAny<Match>())).Returns(allBets);
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser>());

            var sut = new GroupMatchesResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("m1", result);

            // All bets should have 0 DixitBonus (80% correct)
            Assert.All(allBets, b => Assert.Equal(0, b.DixitBonus));
        }
    }
}

