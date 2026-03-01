namespace TipTournament2._0.Tests.Coordinator
{
    using System;
    using System.Collections.Generic;
    using Microsoft.Extensions.Options;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;
    using Xunit;
    using Match = TipTournament2._0.Models.Match;

    public class DeltaResultCoordinatorTests
    {
        private readonly Mock<IMatchClient> mockMatchClient = new Mock<IMatchClient>();
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<IBetResultMaker> mockBetMaker = new Mock<IBetResultMaker>();

        private DeltaResultCoordinator CreateSut(bool additionalDeltaEvaluation = false)
        {
            var featureFlags = Options.Create(new FeatureFlags { AdditionalDeltaEvaluation = additionalDeltaEvaluation });
            return new DeltaResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object, featureFlags);
        }

        [Fact]
        public void UploadNewResult_SetsHomeIdAwayIdAndEnded()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal };
            var tuple = new Tuple<string, string>("teamA", "teamB");

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetDeltaBetsByMatchId("m1")).Returns(new List<DeltaBet>());
            this.mockBetMaker.Setup(b => b.UpdateDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>())).Returns(new List<DeltaBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser>());

            var sut = this.CreateSut();
            sut.UploadNewResult("m1", tuple);

            Assert.Equal("teamA", match.HomeId);
            Assert.Equal("teamB", match.AwayId);
            Assert.True(match.Ended);
            this.mockDb.Verify(d => d.UpdateMatch(match), Times.Once);
        }

        [Fact]
        public void UploadNewResult_FirstRound_DoesNotEvaluateBets()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.FirstRound };
            var tuple = new Tuple<string, string>("teamA", "teamB");

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);

            var sut = this.CreateSut();
            sut.UploadNewResult("m1", tuple);

            this.mockBetMaker.Verify(b => b.UpdateDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>()), Times.Never);
        }

        [Fact]
        public void UploadNewResult_Quarterfinal_EvaluatesDeltaBets()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal };
            var tuple = new Tuple<string, string>("teamA", "teamB");
            var user = new ApplicationUser { Id = "u1", DeltaPoints = 0, TotalPoints = 0 };
            var betResult = new DeltaBetResult { Points = 4 };
            var deltaBet = new DeltaBet { Result = betResult };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetDeltaBetsByMatchId("m1")).Returns(new List<DeltaBet>());
            this.mockBetMaker.Setup(b => b.UpdateDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>())).Returns(new List<DeltaBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetDeltaBetByMatchId("u1", "m1")).Returns(deltaBet);

            var sut = this.CreateSut();
            sut.UploadNewResult("m1", tuple);

            Assert.Equal(4, user.DeltaPoints);
            Assert.Equal(4, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_WithAdditionalDeltaEvaluationTrue_EvaluatesSwappedBets()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal };
            var tuple = new Tuple<string, string>("teamA", "teamB");
            var additionalBet = new DeltaBet
            {
                UserId = "u1",
                Result = new DeltaBetResult { AdditionalResult = new DeltaBetResult { Points = 2 } }
            };
            var user = new ApplicationUser { Id = "u1", DeltaPoints = 0, TotalPoints = 0 };

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetDeltaBetsByMatchId("m1")).Returns(new List<DeltaBet>());
            this.mockBetMaker.Setup(b => b.UpdateDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>())).Returns(new List<DeltaBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetDeltaBetByMatchId("u1", "m1")).Returns((DeltaBet)null);
            this.mockDb.Setup(d => d.GetDeltaBetByStage(TournamentStage.Quarterfinal, "m1")).Returns(new List<DeltaBet>());
            this.mockBetMaker.Setup(b => b.UpdateAdditionalDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>())).Returns(new List<DeltaBet> { additionalBet });
            this.mockDb.Setup(d => d.GetUser("u1")).Returns(user);

            var sut = this.CreateSut(additionalDeltaEvaluation: true);
            sut.UploadNewResult("m1", tuple);

            Assert.Equal(2, user.DeltaPoints);
            Assert.Equal(2, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_WithAdditionalDeltaEvaluationFalse_SkipsAdditionalEvaluation()
        {
            var match = new Match { Id = "m1", Stage = TournamentStage.Quarterfinal };
            var tuple = new Tuple<string, string>("teamA", "teamB");

            this.mockDb.Setup(d => d.GetMatchById("m1")).Returns(match);
            this.mockDb.Setup(d => d.GetDeltaBetsByMatchId("m1")).Returns(new List<DeltaBet>());
            this.mockBetMaker.Setup(b => b.UpdateDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>())).Returns(new List<DeltaBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser>());

            var sut = this.CreateSut(additionalDeltaEvaluation: false);
            sut.UploadNewResult("m1", tuple);

            this.mockBetMaker.Verify(b => b.UpdateAdditionalDeltaBetsResult(It.IsAny<List<DeltaBet>>(), It.IsAny<Match>()), Times.Never);
        }
    }
}
