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
    }
}
