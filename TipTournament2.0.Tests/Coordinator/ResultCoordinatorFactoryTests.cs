namespace TipTournament2._0.Tests.Coordinator
{
    using System;
    using Microsoft.Extensions.Options;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;
    using Xunit;

    public class ResultCoordinatorFactoryTests
    {
        private readonly ResultCoordinatorFactory sut;

        public ResultCoordinatorFactoryTests()
        {
            var mockMatchClient = new Mock<IMatchClient>();
            var mockDb = new Mock<IDbContextWrapper>();
            var mockBetMaker = new Mock<IBetResultMaker>();
            var omikronOptions = Options.Create(new OmikronStageOptions { TeamIds = new string[0] });
            var generalOption = Options.Create(new GeneralOption());
            var featureFlags = Options.Create(new FeatureFlags());

            this.sut = new ResultCoordinatorFactory(
                mockMatchClient.Object,
                mockDb.Object,
                mockBetMaker.Object,
                omikronOptions,
                generalOption,
                featureFlags);
        }

        [Fact]
        public void Create_GroupNoMatchesFalse_ReturnsGroupMatchesResultCoordinator()
        {
            var result = this.sut.Create(TournamentStage.Group, noMatches: false);
            Assert.IsType<GroupMatchesResultCoordinator>(result);
        }

        [Fact]
        public void Create_GroupNoMatchesTrue_ReturnsGroupResultCoordinator()
        {
            var result = this.sut.Create(TournamentStage.Group, noMatches: true);
            Assert.IsType<GroupResultCoordinator>(result);
        }

        [Theory]
        [InlineData(TournamentStage.FirstRound)]
        [InlineData(TournamentStage.Quarterfinal)]
        [InlineData(TournamentStage.Semifinal)]
        [InlineData(TournamentStage.Final)]
        public void Create_KnockoutStages_ReturnsDeltaResultCoordinator(TournamentStage stage)
        {
            var result = this.sut.Create(stage, false);
            Assert.IsType<DeltaResultCoordinator>(result);
        }

        [Fact]
        public void Create_Winner_ReturnsWinnerResultCoordinator()
        {
            var result = this.sut.Create(TournamentStage.Winner, false);
            Assert.IsType<WinnerResultCoordinator>(result);
        }

        [Fact]
        public void Create_Omikron_ReturnsOmikronResultCoordinator()
        {
            var result = this.sut.Create(TournamentStage.Omikron, false);
            Assert.IsType<OmikronResultCoordinator>(result);
        }

        [Fact]
        public void Create_Lambda_ReturnsLambdaResultCoordinator()
        {
            var result = this.sut.Create(TournamentStage.Lambda, false);
            Assert.IsType<LambdaResultCoordinator>(result);
        }

        [Fact]
        public void Create_UnknownStage_ThrowsNotSupportedException()
        {
            Assert.Throws<NotSupportedException>(() => this.sut.Create((TournamentStage)99, false));
        }
    }
}
