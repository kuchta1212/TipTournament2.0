namespace TipTournament2._0.Tests.Coordinator
{
    using System.Collections.Generic;
    using Moq;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using Xunit;

    public class LambdaResultCoordinatorTests
    {
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<IBetResultMaker> mockBetMaker = new Mock<IBetResultMaker>();

        [Fact]
        public void UploadNewResult_CorrectShooter_Gets7LambdaAndTotalPoints()
        {
            var user = new ApplicationUser { Id = "u1", LambdaPoints = 0, TotalPoints = 0 };
            var bet = new TopShooterBet { Points = 7 };

            this.mockDb.Setup(d => d.GetShooterBets()).Returns(new List<TopShooterBet>());
            this.mockBetMaker.Setup(b => b.UpdateLambdaResults(It.IsAny<List<TopShooterBet>>(), "Ronaldo")).Returns(new List<TopShooterBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetShooterBet("u1")).Returns(bet);

            var sut = new LambdaResultCoordinator(this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("", "Ronaldo");

            Assert.Equal(7, user.LambdaPoints);
            Assert.Equal(7, user.TotalPoints);
        }

        [Fact]
        public void UploadNewResult_WrongShooter_Gets0Points()
        {
            var user = new ApplicationUser { Id = "u1", LambdaPoints = 0, TotalPoints = 0 };
            var bet = new TopShooterBet { Points = 0 };

            this.mockDb.Setup(d => d.GetShooterBets()).Returns(new List<TopShooterBet>());
            this.mockBetMaker.Setup(b => b.UpdateLambdaResults(It.IsAny<List<TopShooterBet>>(), "Ronaldo")).Returns(new List<TopShooterBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetShooterBet("u1")).Returns(bet);

            var sut = new LambdaResultCoordinator(this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("", "Ronaldo");

            Assert.Equal(0, user.LambdaPoints);
            Assert.Equal(0, user.TotalPoints);
        }
    }
}
