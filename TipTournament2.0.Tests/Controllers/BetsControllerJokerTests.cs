namespace TipTournament2._0.Tests.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
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

    public class BetsControllerJokerTests
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

        #region Validation: match must exist

        [Fact]
        public void SetJoker_MatchNotFound_ReturnsBadRequest()
        {
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns((Match)null);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpdateBets(It.IsAny<List<MatchBet>>()), Times.Never);
        }

        #endregion

        #region Validation: only group stage matches allowed

        [Fact]
        public void SetJoker_NotGroupMatch_ReturnsBadRequest()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal, StartTime = DateTime.UtcNow.AddHours(1) };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpdateBets(It.IsAny<List<MatchBet>>()), Times.Never);
        }

        [Theory]
        [InlineData(TournamentStage.FirstRound)]
        [InlineData(TournamentStage.Quarterfinal)]
        [InlineData(TournamentStage.Semifinal)]
        [InlineData(TournamentStage.Final)]
        public void SetJoker_AllKnockoutStages_ReturnsBadRequest(TournamentStage stage)
        {
            var match = new Match { Id = "m1", Stage = stage, StartTime = DateTime.UtcNow.AddHours(1) };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        #endregion

        #region Validation: match must not have started

        [Fact]
        public void SetJoker_MatchAlreadyStarted_ReturnsBadRequest()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(-1), Round = 1 };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpdateBets(It.IsAny<List<MatchBet>>()), Times.Never);
        }

        [Fact]
        public void SetJoker_MatchStartedExactlyNow_ReturnsBadRequest()
        {
            // Edge case: StartTime == UtcNow (>= check)
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow, Round = 1 };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        #endregion

        #region Validation: user must have a bet on the match

        [Fact]
        public void SetJoker_NoBetOnMatch_ReturnsBadRequest()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };
            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            // Return round bets but none for this specific match
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(new List<MatchBet>());

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpdateBets(It.IsAny<List<MatchBet>>()), Times.Never);
        }

        [Fact]
        public void SetJoker_OtherBetsExistButNotForThisMatch_ReturnsBadRequest()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };
            var otherMatch = new Match { Id = "m2" };
            var otherBet = new MatchBet { Id = "b2", Match = otherMatch, IsJoker = false };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(new List<MatchBet> { otherBet });

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
            this.mockDb.Verify(d => d.UpdateBets(It.IsAny<List<MatchBet>>()), Times.Never);
        }

        #endregion

        #region Happy path: sets joker and clears previous

        [Fact]
        public void SetJoker_ValidRequest_SetsJokerAndClearsPrevious()
        {
            var targetMatch = new Match { Id = "m1" };
            var otherMatch = new Match { Id = "m2", StartTime = DateTime.UtcNow.AddHours(2) };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };

            var targetBet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var previousJokerBet = new MatchBet { Id = "b2", Match = otherMatch, IsJoker = true };
            var roundBets = new List<MatchBet> { targetBet, previousJokerBet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(targetBet.IsJoker);
            Assert.False(previousJokerBet.IsJoker);
            this.mockDb.Verify(d => d.UpdateBets(roundBets), Times.Once);
        }

        [Fact]
        public void SetJoker_NoPreviousJoker_SetsJokerOnTarget()
        {
            var targetMatch = new Match { Id = "m1" };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 2 };
            var bet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var roundBets = new List<MatchBet> { bet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 2)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(bet.IsJoker);
            this.mockDb.Verify(d => d.UpdateBets(roundBets), Times.Once);
        }

        #endregion

        #region Re-setting joker on same match (idempotent)

        [Fact]
        public void SetJoker_AlreadyJokerOnSameMatch_StaysJoker()
        {
            var targetMatch = new Match { Id = "m1", StartTime = DateTime.UtcNow.AddHours(1) };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };
            var bet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = true };
            var roundBets = new List<MatchBet> { bet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(bet.IsJoker);
        }

        #endregion

        #region Round independence: joker on round 1 doesn't affect round 2

        [Fact]
        public void SetJoker_DifferentRoundsAreIndependent()
        {
            // Set joker on round 2 — round 1 joker should be unaffected
            var targetMatch = new Match { Id = "m3" };
            var match = new Match { Id = "m3", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 2 };
            var round2Bet = new MatchBet { Id = "b3", Match = targetMatch, IsJoker = false };
            var round2Bets = new List<MatchBet> { round2Bet };

            // Round 1 has its own joker — not returned by GetBetsForUserAndRound(round=2)
            this.mockDb.Setup(d => d.GetMatchById("m3")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 2)).Returns(round2Bets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m3");

            Assert.IsType<OkResult>(result);
            Assert.True(round2Bet.IsJoker);

            // Verify only round 2 bets were updated
            this.mockDb.Verify(d => d.UpdateBets(round2Bets), Times.Once);
            this.mockDb.Verify(d => d.GetBetsForUserAndRound("test-user", 1), Times.Never);
        }

        #endregion

        #region Multiple bets in same round: only target gets joker

        [Fact]
        public void SetJoker_MultipleRoundBets_OnlyTargetGetsJoker()
        {
            var targetMatch = new Match { Id = "m1" };
            var otherMatch1 = new Match { Id = "m2" };
            var otherMatch2 = new Match { Id = "m3" };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };

            var targetBet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var otherBet1 = new MatchBet { Id = "b2", Match = otherMatch1, IsJoker = false };
            var otherBet2 = new MatchBet { Id = "b3", Match = otherMatch2, IsJoker = false };
            var roundBets = new List<MatchBet> { targetBet, otherBet1, otherBet2 };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(targetBet.IsJoker);
            Assert.False(otherBet1.IsJoker);
            Assert.False(otherBet2.IsJoker);
        }

        [Fact]
        public void SetJoker_SwitchFromOneMatchToAnother_InSameRound()
        {
            // Joker is on m2, user wants to move it to m1
            var targetMatch = new Match { Id = "m1" };
            var otherMatch = new Match { Id = "m2", StartTime = DateTime.UtcNow.AddHours(2) };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };

            var targetBet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var previousJokerBet = new MatchBet { Id = "b2", Match = otherMatch, IsJoker = true };
            var roundBets = new List<MatchBet> { targetBet, previousJokerBet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(targetBet.IsJoker);
            Assert.False(previousJokerBet.IsJoker);

            // Exactly one joker in round
            Assert.Equal(1, roundBets.Count(b => b.IsJoker));
        }

        #endregion

        #region Constraint: exactly 1 joker per round after SetJoker

        [Fact]
        public void SetJoker_AlwaysResultsInExactlyOneJokerInRound()
        {
            var targetMatch = new Match { Id = "m1" };
            var otherMatch1 = new Match { Id = "m2", StartTime = DateTime.UtcNow.AddHours(2) };
            var otherMatch2 = new Match { Id = "m3", StartTime = DateTime.UtcNow.AddHours(3) };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };

            // Simulate a corrupted state: 2 jokers somehow exist in round
            var targetBet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var badJoker1 = new MatchBet { Id = "b2", Match = otherMatch1, IsJoker = true };
            var badJoker2 = new MatchBet { Id = "b3", Match = otherMatch2, IsJoker = true };
            var roundBets = new List<MatchBet> { targetBet, badJoker1, badJoker2 };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);

            // All cleared, only target is joker
            Assert.True(targetBet.IsJoker);
            Assert.False(badJoker1.IsJoker);
            Assert.False(badJoker2.IsJoker);
            Assert.Equal(1, roundBets.Count(b => b.IsJoker));
        }

        #endregion

        #region Round=0 edge case

        [Fact]
        public void SetJoker_MatchWithRound0_StillWorksIfBetExists()
        {
            // Round=0 is the default for matches without a round set.
            // SetJoker should still work — it fetches bets for round 0.
            var targetMatch = new Match { Id = "m1" };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 0 };
            var bet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var roundBets = new List<MatchBet> { bet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 0)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(bet.IsJoker);
        }

        #endregion

        #region Joker locked when existing joker match already started

        [Fact]
        public void SetJoker_ExistingJokerOnStartedMatch_ReturnsBadRequest()
        {
            // Joker is on m2 which already started. User tries to move joker to m1 (not started).
            // This must be rejected — the round's joker is locked.
            var targetMatch = new Match { Id = "m1" };
            var startedMatch = new Match { Id = "m2", StartTime = DateTime.UtcNow.AddHours(-1) };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };

            var targetBet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var lockedJokerBet = new MatchBet { Id = "b2", Match = startedMatch, IsJoker = true };
            var roundBets = new List<MatchBet> { targetBet, lockedJokerBet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<BadRequestObjectResult>(result);
            // Joker should not have changed
            Assert.False(targetBet.IsJoker);
            Assert.True(lockedJokerBet.IsJoker);
            this.mockDb.Verify(d => d.UpdateBets(It.IsAny<List<MatchBet>>()), Times.Never);
        }

        [Fact]
        public void SetJoker_ExistingJokerOnNotStartedMatch_CanSwitch()
        {
            // Joker is on m2 which has NOT started. User can move joker to m1.
            var targetMatch = new Match { Id = "m1" };
            var notStartedMatch = new Match { Id = "m2", StartTime = DateTime.UtcNow.AddHours(2) };
            var match = new Match { Id = "m1", Stage = TournamentStage.Group, StartTime = DateTime.UtcNow.AddHours(1), Round = 1 };

            var targetBet = new MatchBet { Id = "b1", Match = targetMatch, IsJoker = false };
            var previousJokerBet = new MatchBet { Id = "b2", Match = notStartedMatch, IsJoker = true };
            var roundBets = new List<MatchBet> { targetBet, previousJokerBet };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetBetsForUserAndRound("test-user", 1)).Returns(roundBets);

            var sut = this.CreateSut();
            var result = sut.SetJoker("m1");

            Assert.IsType<OkResult>(result);
            Assert.True(targetBet.IsJoker);
            Assert.False(previousJokerBet.IsJoker);
        }

        #endregion
    }
}
