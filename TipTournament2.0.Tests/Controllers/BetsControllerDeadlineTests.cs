namespace TipTournament2._0.Tests.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Security.Claims;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Moq;
    using TipTournament2._0.Controllers;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;
    using Xunit;
    using Match = TipTournament2._0.Models.Match;

    public class BetsControllerDeadlineTests
    {
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<ITeamGenerator> mockTeamGen = new Mock<ITeamGenerator>();

        private BetsController CreateSut()
        {
            var controller = new BetsController(this.mockDb.Object, this.mockTeamGen.Object);

            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "test-user") };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            return controller;
        }

        #region GetDeadlines

        [Fact]
        public void GetDeadlines_ReturnsTournamentStartForGroupWinnerLambdaOmikron()
        {
            var tournamentStart = new DateTime(2024, 6, 14, 21, 0, 0);
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(tournamentStart);
            this.mockDb.Setup(d => d.GetStageStartTime(TournamentStage.RoundOf32)).Returns(new DateTime(2024, 6, 29, 21, 0, 0));

            var sut = this.CreateSut();
            var result = sut.GetDeadlines() as OkObjectResult;
            var deadlines = result.Value as DeadlineInfo;

            Assert.Equal(tournamentStart, deadlines.TournamentStart);
            Assert.Equal(tournamentStart, deadlines.StageDeadlines[nameof(TournamentStage.Group)]);
            Assert.Equal(tournamentStart, deadlines.StageDeadlines[nameof(TournamentStage.Winner)]);
            Assert.Equal(tournamentStart, deadlines.StageDeadlines[nameof(TournamentStage.Lambda)]);
            Assert.Equal(tournamentStart, deadlines.StageDeadlines[nameof(TournamentStage.Omikron)]);
        }

        [Fact]
        public void GetDeadlines_AllKnockoutStagesShareRoundOf32Deadline()
        {
            var tournamentStart = new DateTime(2024, 6, 14, 21, 0, 0);
            var firstRoundStart = new DateTime(2024, 6, 29, 21, 0, 0);
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(tournamentStart);
            this.mockDb.Setup(d => d.GetStageStartTime(TournamentStage.RoundOf32)).Returns(firstRoundStart);

            var sut = this.CreateSut();
            var result = sut.GetDeadlines() as OkObjectResult;
            var deadlines = result.Value as DeadlineInfo;

            Assert.Equal(firstRoundStart, deadlines.StageDeadlines[nameof(TournamentStage.RoundOf32)]);
            Assert.Equal(firstRoundStart, deadlines.StageDeadlines[nameof(TournamentStage.RoundOf16)]);
            Assert.Equal(firstRoundStart, deadlines.StageDeadlines[nameof(TournamentStage.Quarterfinal)]);
            Assert.Equal(firstRoundStart, deadlines.StageDeadlines[nameof(TournamentStage.Semifinal)]);
            Assert.Equal(firstRoundStart, deadlines.StageDeadlines[nameof(TournamentStage.Final)]);
        }

        [Fact]
        public void GetDeadlines_NoRoundOf32Matches_ReturnsMaxValueForKnockout()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(new DateTime(2024, 6, 14, 21, 0, 0));
            this.mockDb.Setup(d => d.GetStageStartTime(TournamentStage.RoundOf32)).Throws(new InvalidOperationException());

            var sut = this.CreateSut();
            var result = sut.GetDeadlines() as OkObjectResult;
            var deadlines = result.Value as DeadlineInfo;

            Assert.Equal(DateTime.MaxValue, deadlines.StageDeadlines[nameof(TournamentStage.RoundOf32)]);
            Assert.Equal(DateTime.MaxValue, deadlines.StageDeadlines[nameof(TournamentStage.Quarterfinal)]);
        }

        #endregion

        #region UploadTip (per-match deadline)

        [Fact]
        public void UploadTip_MatchNotFound_ReturnsBadRequest()
        {
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns((Match)null);

            var sut = this.CreateSut();
            var result = sut.UploadTip(new UploadTipRequest { MatchId = "m1", Tip = new Result() });

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void UploadTip_MatchAlreadyStarted_ReturnsBadRequest()
        {
            var match = new Match { Id = "m1", StartTime = DateTime.UtcNow.AddHours(-1) };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            var result = sut.UploadTip(new UploadTipRequest { MatchId = "m1", Tip = new Result() });

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UploadTip(It.IsAny<Result>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void UploadTip_MatchNotStarted_ReturnsOk()
        {
            var match = new Match { Id = "m1", StartTime = DateTime.UtcNow.AddHours(1) };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            var result = sut.UploadTip(new UploadTipRequest { MatchId = "m1", Tip = new Result() });

            Assert.IsType<OkResult>(result);
            this.mockDb.Verify(d => d.UploadTip(It.IsAny<Result>(), "m1", "test-user"), Times.Once);
        }

        #endregion

        #region UploadGroupBet (tournament start deadline)

        [Fact]
        public void UploadGroupBet_TournamentStarted_ReturnsBadRequest()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(DateTime.UtcNow.AddHours(-1));

            var sut = this.CreateSut();
            var result = sut.UploadGroupBet(new GroupBet(), "g1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UploadGroupBet(It.IsAny<GroupBet>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void UploadGroupBet_TournamentNotStarted_ReturnsOk()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(DateTime.UtcNow.AddHours(1));

            var sut = this.CreateSut();
            var result = sut.UploadGroupBet(new GroupBet(), "g1");

            Assert.IsType<OkResult>(result);
            this.mockDb.Verify(d => d.UploadGroupBet(It.IsAny<GroupBet>(), "g1", "test-user"), Times.Once);
        }

        #endregion

        #region UploadDeltaBet (knockout deadline = RoundOf32 start)

        [Fact]
        public void UploadDeltaBet_MatchNotFound_ReturnsBadRequest()
        {
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns((Match)null);

            var sut = this.CreateSut();
            var result = sut.UploadDeltaBet(new DeltaBet(), "m1");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void UploadDeltaBet_RoundOf32Started_ReturnsBadRequest()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetStageStartTime(TournamentStage.RoundOf32)).Returns(DateTime.UtcNow.AddHours(-1));

            var sut = this.CreateSut();
            var result = sut.UploadDeltaBet(new DeltaBet(), "m1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpsertDeltaBet(It.IsAny<DeltaBet>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void UploadDeltaBet_RoundOf32NotStarted_ReturnsOk()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetStageStartTime(TournamentStage.RoundOf32)).Returns(DateTime.UtcNow.AddHours(1));

            var sut = this.CreateSut();
            var result = sut.UploadDeltaBet(new DeltaBet(), "m1");

            Assert.IsType<OkResult>(result);
            this.mockDb.Verify(d => d.UpsertDeltaBet(It.IsAny<DeltaBet>(), "m1", "test-user"), Times.Once);
        }

        [Theory]
        [InlineData(TournamentStage.RoundOf32)]
        [InlineData(TournamentStage.RoundOf16)]
        [InlineData(TournamentStage.Quarterfinal)]
        [InlineData(TournamentStage.Semifinal)]
        [InlineData(TournamentStage.Final)]
        public void UploadDeltaBet_AllKnockoutStagesUseRoundOf32Deadline(TournamentStage stage)
        {
            var match = new Match { Id = "m1", Stage = stage };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetStageStartTime(TournamentStage.RoundOf32)).Returns(DateTime.UtcNow.AddHours(-1));

            var sut = this.CreateSut();
            var result = sut.UploadDeltaBet(new DeltaBet(), "m1");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        #endregion

        #region UploadTeamPlaceBet (tournament start deadline)

        [Fact]
        public void UploadTeamPlaceBet_TournamentStarted_ReturnsBadRequest()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(DateTime.UtcNow.AddHours(-1));

            var sut = this.CreateSut();
            var result = sut.UploadTeamPlaceBet("team1", true, TournamentStage.Winner);

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpsertTeamPlaceBet(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<TournamentStage>()), Times.Never);
        }

        [Fact]
        public void UploadTeamPlaceBet_TournamentNotStarted_ReturnsOk()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(DateTime.UtcNow.AddHours(1));
            this.mockDb.Setup(d => d.GetTeamPlaceBet("test-user", true)).Returns(new SpecificTeamPlaceBet());

            var sut = this.CreateSut();
            var result = sut.UploadTeamPlaceBet("team1", true, TournamentStage.Winner);

            Assert.IsType<OkObjectResult>(result);
            this.mockDb.Verify(d => d.UpsertTeamPlaceBet("team1", "test-user", true, TournamentStage.Winner), Times.Once);
        }

        #endregion

        #region UploadShooterBet (tournament start deadline)

        [Fact]
        public void UploadShooterBet_TournamentStarted_ReturnsBadRequest()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(DateTime.UtcNow.AddHours(-1));

            var sut = this.CreateSut();
            var result = sut.UploadShooterBet("Mbappe");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpsertShooterBet(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void UploadShooterBet_TournamentNotStarted_ReturnsOk()
        {
            this.mockDb.Setup(d => d.GetTournamentStartTime()).Returns(DateTime.UtcNow.AddHours(1));
            this.mockDb.Setup(d => d.GetShooterBet("test-user")).Returns(new TopShooterBet());

            var sut = this.CreateSut();
            var result = sut.UploadShooterBet("Mbappe");

            Assert.IsType<OkObjectResult>(result);
            this.mockDb.Verify(d => d.UpsertShooterBet("Mbappe", "test-user"), Times.Once);
        }

        #endregion

        #region GetTeamPlaceBetTeams (Winner returns all teams)

        [Fact]
        public void GetTeamPlaceBetTeams_WinnerBet_ReturnsAllTeams()
        {
            var allTeams = new List<Team>
            {
                new Team { Id = "t1", Name = "Germany" },
                new Team { Id = "t2", Name = "France" },
                new Team { Id = "t3", Name = "Spain" }
            };
            this.mockDb.Setup(d => d.GetAllTeams()).Returns(allTeams);

            var sut = this.CreateSut();
            var result = sut.GetTeamPlaceBetTeams(true) as OkObjectResult;
            var teams = result.Value as Team[];

            Assert.Equal(3, teams.Length);
            this.mockTeamGen.Verify(t => t.GetFinalists(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void GetTeamPlaceBetTeams_NotWinnerBet_UsesTeamGenerator()
        {
            var specificTeams = new Team[] { new Team { Id = "cz" }, new Team { Id = "sk" } };
            this.mockTeamGen.Setup(t => t.GenerateSpecificBetTeams()).Returns(specificTeams);

            var sut = this.CreateSut();
            var result = sut.GetTeamPlaceBetTeams(false) as OkObjectResult;
            var teams = result.Value as Team[];

            Assert.Equal(2, teams.Length);
            this.mockDb.Verify(d => d.GetAllTeams(), Times.Never);
        }

        #endregion
    }
}
