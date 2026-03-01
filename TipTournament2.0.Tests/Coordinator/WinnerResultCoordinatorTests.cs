namespace TipTournament2._0.Tests.Coordinator
{
    using System.Collections.Generic;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using Xunit;

    public class WinnerResultCoordinatorTests
    {
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<IBetResultMaker> mockBetMaker = new Mock<IBetResultMaker>();

        [Fact]
        public void UploadNewResult_CorrectWinnerBet_Gets3DeltaAndTotalPoints()
        {
            var user = new ApplicationUser { Id = "u1", DeltaPoints = 0, TotalPoints = 0 };
            var bet = new SpecificTeamPlaceBet { IsCorrect = true };

            this.mockDb.Setup(d => d.GetOmikronBets(true)).Returns(new List<SpecificTeamPlaceBet>());
            this.mockBetMaker.Setup(b => b.UpdateWinnerBets(It.IsAny<List<SpecificTeamPlaceBet>>(), "teamA")).Returns(new List<SpecificTeamPlaceBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetTeamPlaceBet("u1", true)).Returns(bet);

            var sut = new WinnerResultCoordinator(this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("", "teamA");

            Assert.Equal(3, user.DeltaPoints);
            Assert.Equal(3, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_WrongWinnerBet_Gets0Points()
        {
            var user = new ApplicationUser { Id = "u1", DeltaPoints = 0, TotalPoints = 0 };
            var bet = new SpecificTeamPlaceBet { IsCorrect = false };

            this.mockDb.Setup(d => d.GetOmikronBets(true)).Returns(new List<SpecificTeamPlaceBet>());
            this.mockBetMaker.Setup(b => b.UpdateWinnerBets(It.IsAny<List<SpecificTeamPlaceBet>>(), "teamA")).Returns(new List<SpecificTeamPlaceBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetTeamPlaceBet("u1", true)).Returns(bet);

            var sut = new WinnerResultCoordinator(this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("", "teamA");

            Assert.Equal(0, user.DeltaPoints);
            Assert.Equal(0, user.TotalPoints);
        }
    }
}
