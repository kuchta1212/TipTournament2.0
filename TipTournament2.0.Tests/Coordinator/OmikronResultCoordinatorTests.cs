namespace TipTournament2._0.Tests.Coordinator
{
    using System.Collections.Generic;
    using Microsoft.Extensions.Options;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;
    using Xunit;
    using Match = TipTournament2._0.Models.Match;

    public class OmikronResultCoordinatorTests
    {
        [Theory]
        [InlineData(TournamentStage.Group, 3)]
        [InlineData(TournamentStage.RoundOf32, 3)]
        [InlineData(TournamentStage.RoundOf16, 5)]
        [InlineData(TournamentStage.Quarterfinal, 8)]
        [InlineData(TournamentStage.Semifinal, 12)]
        [InlineData(TournamentStage.Final, 15)]
        [InlineData(TournamentStage.Winner, 18)]
        public void RecalculatePoints_CorrectBetForStage_AddsExpectedPoints(TournamentStage stage, int expectedPoints)
        {
            var mockDb = new Mock<IDbContextWrapper>();
            var mockBetMaker = new Mock<IBetResultMaker>();
            var omikronOptions = Options.Create(new OmikronStageOptions { TeamIds = new[] { "t1" } });
            var generalOption = Options.Create(new GeneralOption { FinalMatchId = "final1" });

            var user = new ApplicationUser { Id = "u1", OmikronPoints = 0, TotalPoints = 0 };
            var bet = new SpecificTeamPlaceBet { IsCorrect = true, StageBet = stage };

            // Return empty match list for all stages so GetResults logic resolves quickly
            mockDb.Setup(d => d.GetMatches(It.IsAny<TournamentStage>())).Returns(new List<Match>());
            mockDb.Setup(d => d.GetMatchById("final1")).Returns(new Match
            {
                HomeId = "t1", AwayId = "other",
                Result = new Result { HomeTeam = 1, AwayTeam = 0 }
            });
            mockDb.Setup(d => d.GetOmikronBets(false)).Returns(new List<SpecificTeamPlaceBet>());
            mockBetMaker.Setup(b => b.UpdateOmikronBets(It.IsAny<List<SpecificTeamPlaceBet>>(), It.IsAny<List<SpecificTeamPlaceBet>>())).Returns(new List<SpecificTeamPlaceBet>());
            mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            mockDb.Setup(d => d.GetTeamPlaceBet("u1", false)).Returns(bet);

            var sut = new OmikronResultCoordinator(mockDb.Object, mockBetMaker.Object, omikronOptions, generalOption);
            sut.UploadNewResult("", "");

            Assert.Equal(expectedPoints, user.OmikronPoints);
            Assert.Equal(expectedPoints, user.TotalPoints);
        }

        [Fact]
        public void RecalculatePoints_IncorrectBet_Gets0Points()
        {
            var mockDb = new Mock<IDbContextWrapper>();
            var mockBetMaker = new Mock<IBetResultMaker>();
            var omikronOptions = Options.Create(new OmikronStageOptions { TeamIds = new[] { "t1" } });
            var generalOption = Options.Create(new GeneralOption { FinalMatchId = "final1" });

            var user = new ApplicationUser { Id = "u1", OmikronPoints = 0, TotalPoints = 0 };
            var bet = new SpecificTeamPlaceBet { IsCorrect = false, StageBet = TournamentStage.Quarterfinal };

            mockDb.Setup(d => d.GetMatches(It.IsAny<TournamentStage>())).Returns(new List<Match>());
            mockDb.Setup(d => d.GetMatchById("final1")).Returns(new Match
            {
                HomeId = "t1", AwayId = "other",
                Result = new Result { HomeTeam = 1, AwayTeam = 0 }
            });
            mockDb.Setup(d => d.GetOmikronBets(false)).Returns(new List<SpecificTeamPlaceBet>());
            mockBetMaker.Setup(b => b.UpdateOmikronBets(It.IsAny<List<SpecificTeamPlaceBet>>(), It.IsAny<List<SpecificTeamPlaceBet>>())).Returns(new List<SpecificTeamPlaceBet>());
            mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            mockDb.Setup(d => d.GetTeamPlaceBet("u1", false)).Returns(bet);

            var sut = new OmikronResultCoordinator(mockDb.Object, mockBetMaker.Object, omikronOptions, generalOption);
            sut.UploadNewResult("", "");

            Assert.Equal(0, user.OmikronPoints);
            Assert.Equal(0, user.TotalPoints);
        }
    }
}
