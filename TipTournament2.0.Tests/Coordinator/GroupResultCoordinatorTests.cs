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

    public class GroupResultCoordinatorTests
    {
        private readonly Mock<IMatchClient> mockMatchClient = new Mock<IMatchClient>();
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<IBetResultMaker> mockBetMaker = new Mock<IBetResultMaker>();

        [Fact]
        public void UploadNewResult_SavesGroupResultAndUpdatesGroup()
        {
            var groupResult = new GroupResult { FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4" };
            var savedResult = new GroupResult { Id = "gr1", FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4" };
            var group = new Group { Id = "g1" };

            this.mockDb.Setup(d => d.GetGroupById("g1")).Returns(group);
            this.mockDb.Setup(d => d.SaveResult(groupResult)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetGroupBetsByGroupId("g1")).Returns(new List<GroupBet>());
            this.mockBetMaker.Setup(b => b.UpdateGroupBetsResult(It.IsAny<List<GroupBet>>(), It.IsAny<GroupResult>())).Returns(new List<GroupBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser>());

            var sut = new GroupResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("g1", groupResult);

            Assert.Equal(savedResult, group.Result);
            this.mockDb.Verify(d => d.UpdateGroup(group), Times.Once);
        }

        [Fact]
        public void UploadNewResult_UserWith3CorrectPositions_Gets3GamaAndTotalPoints()
        {
            var groupResult = new GroupResult { FirstId = "t1", SecondId = "t2", ThirdId = "t3", FourthId = "t4" };
            var savedResult = new GroupResult { Id = "gr1" };
            var group = new Group { Id = "g1" };
            var user = new ApplicationUser { Id = "u1", GamaPoints = 0, TotalPoints = 0 };
            var betResult = new GroupBetResult { Points = 3 };
            var groupBet = new GroupBet { Result = betResult };

            this.mockDb.Setup(d => d.GetGroupById("g1")).Returns(group);
            this.mockDb.Setup(d => d.SaveResult(groupResult)).Returns(savedResult);
            this.mockDb.Setup(d => d.GetGroupBetsByGroupId("g1")).Returns(new List<GroupBet>());
            this.mockBetMaker.Setup(b => b.UpdateGroupBetsResult(It.IsAny<List<GroupBet>>(), It.IsAny<GroupResult>())).Returns(new List<GroupBet>());
            this.mockDb.Setup(d => d.GetAllUsers()).Returns(new List<ApplicationUser> { user });
            this.mockDb.Setup(d => d.GetGroupBetByGroupId("g1", "u1")).Returns(groupBet);

            var sut = new GroupResultCoordinator(this.mockMatchClient.Object, this.mockDb.Object, this.mockBetMaker.Object);
            sut.UploadNewResult("g1", groupResult);

            Assert.Equal(3, user.GamaPoints);
            Assert.Equal(3, user.TotalPoints);
        }
    }
}
