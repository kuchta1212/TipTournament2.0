namespace TipTournament2._0.Tests.Utils
{
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Extensions.Options;
    using Moq;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;
    using Xunit;
    using Match = TipTournament2._0.Models.Match;

    public class BetGeneratorTests
    {
        private readonly Mock<IDbContextWrapper> mockDb = new Mock<IDbContextWrapper>();
        private readonly Mock<ITeamGenerator> mockTeamGen = new Mock<ITeamGenerator>();

        private BetGenerator CreateSut(int groupCount = 6, Dictionary<TournamentStage, int> matchCount = null)
        {
            var generalOption = Options.Create(new GeneralOption
            {
                GroupCount = groupCount,
                MatchCount = matchCount ?? new Dictionary<TournamentStage, int>
                {
                    { TournamentStage.Group, 36 },
                    { TournamentStage.FirstRound, 8 },
                    { TournamentStage.Quarterfinal, 4 },
                    { TournamentStage.Semifinal, 2 },
                    { TournamentStage.Final, 1 }
                }
            });

            return new BetGenerator(this.mockDb.Object, this.mockTeamGen.Object, generalOption);
        }

        #region GetBetsStatus

        [Fact]
        public void GetBetsStatus_NullBetsStatus_ReturnsNotReady()
        {
            this.mockDb.Setup(d => d.GetBetsStatus("u1")).Returns((BetsStatus)null);

            var sut = this.CreateSut();
            var result = sut.GetBetsStatus(TournamentStage.Group, "u1");

            Assert.Equal(BetsStageStatus.NotReady, result);
        }

        [Fact]
        public void GetBetsStatus_GroupStageMatchesDone_ReturnsDone()
        {
            this.mockDb.Setup(d => d.GetBetsStatus("u1")).Returns(new BetsStatus { MatchesInGroupsDone = true });

            var sut = this.CreateSut();
            var result = sut.GetBetsStatus(TournamentStage.Group, "u1");

            Assert.Equal(BetsStageStatus.Done, result);
        }

        [Fact]
        public void GetBetsStatus_GroupStageMatchesNotDone_ReturnsReady()
        {
            this.mockDb.Setup(d => d.GetBetsStatus("u1")).Returns(new BetsStatus { MatchesInGroupsDone = false });

            var sut = this.CreateSut();
            var result = sut.GetBetsStatus(TournamentStage.Group, "u1");

            Assert.Equal(BetsStageStatus.Ready, result);
        }

        [Fact]
        public void GetBetsStatus_FirstRound_GroupStagesDoneAndFirstNotDone_ReturnsReady()
        {
            this.mockDb.Setup(d => d.GetBetsStatus("u1")).Returns(new BetsStatus
            {
                GroupStagesDone = true,
                FirstStagesDones = false
            });

            var sut = this.CreateSut();
            var result = sut.GetBetsStatus(TournamentStage.FirstRound, "u1");

            Assert.Equal(BetsStageStatus.Ready, result);
        }

        [Fact]
        public void GetBetsStatus_FirstRound_GroupStagesNotDone_ReturnsNotReady()
        {
            this.mockDb.Setup(d => d.GetBetsStatus("u1")).Returns(new BetsStatus
            {
                GroupStagesDone = false,
                FirstStagesDones = false
            });

            var sut = this.CreateSut();
            var result = sut.GetBetsStatus(TournamentStage.FirstRound, "u1");

            Assert.Equal(BetsStageStatus.NotReady, result);
        }

        #endregion

        #region CheckGroupMatchesAndGenerateTableResults

        private (Group group, List<Match> matches, Team[] teams) CreateGroupWith4Teams()
        {
            var t1 = new Team { Id = "t1", Name = "T1" };
            var t2 = new Team { Id = "t2", Name = "T2" };
            var t3 = new Team { Id = "t3", Name = "T3" };
            var t4 = new Team { Id = "t4", Name = "T4" };

            // 6 round-robin matches for a group of 4
            var m1 = new Match { Id = "m1", Home = t1, Away = t2 };
            var m2 = new Match { Id = "m2", Home = t1, Away = t3 };
            var m3 = new Match { Id = "m3", Home = t1, Away = t4 };
            var m4 = new Match { Id = "m4", Home = t2, Away = t3 };
            var m5 = new Match { Id = "m5", Home = t2, Away = t4 };
            var m6 = new Match { Id = "m6", Home = t3, Away = t4 };

            var matches = new List<Match> { m1, m2, m3, m4, m5, m6 };
            var group = new Group { Id = "g1", Matches = matches };

            return (group, matches, new[] { t1, t2, t3, t4 });
        }

        [Fact]
        public void CheckGroupMatchesAndGenerateTableResults_HomeWins_HomeTeamRankedFirst()
        {
            var (group, matches, teams) = this.CreateGroupWith4Teams();

            // t1 wins all 3 home games (9 pts), all other matches are ties (1 pt each = 3 pts each for t2,t3,t4)
            var bets = new Dictionary<string, MatchBet>
            {
                { "m1", new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } } }, // t1 wins
                { "m2", new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } } }, // t1 wins
                { "m3", new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } } }, // t1 wins
                { "m4", new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } } }, // tie
                { "m5", new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } } }, // tie
                { "m6", new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } } }, // tie
            };

            this.mockDb.Setup(d => d.GetBetsForUser("u1")).Returns(new List<MatchBet>(new MatchBet[36]));
            this.mockDb.Setup(d => d.GetGroups(true)).Returns(new[] { group });
            this.mockDb.Setup(d => d.GetGroupTeams("g1")).Returns(teams);
            foreach (var m in matches)
            {
                this.mockDb.Setup(d => d.GetBetForMatchAndUser(m, "u1")).Returns(bets[m.Id]);
            }

            var sut = this.CreateSut();
            var result = sut.CheckGroupMatchesAndGenerateTableResults("u1");

            Assert.True(result);
            this.mockDb.Verify(d => d.UpsertGroupBet(It.Is<GroupBet>(gb =>
                gb.FirstId == "t1"
            )), Times.Once);
        }

        [Fact]
        public void CheckGroupMatchesAndGenerateTableResults_AwayWins_AwayTeamRankedFirst()
        {
            var (group, matches, teams) = this.CreateGroupWith4Teams();

            // t2 wins as away in m1, and wins as home in m4, m5. t3 wins m6. t1 loses all.
            var bets = new Dictionary<string, MatchBet>
            {
                { "m1", new MatchBet { Tip = new Result { HomeTeam = 0, AwayTeam = 2 } } }, // t2 wins (away)
                { "m2", new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } } }, // tie
                { "m3", new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } } }, // tie
                { "m4", new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } } }, // t2 wins
                { "m5", new MatchBet { Tip = new Result { HomeTeam = 2, AwayTeam = 0 } } }, // t2 wins
                { "m6", new MatchBet { Tip = new Result { HomeTeam = 1, AwayTeam = 1 } } }, // tie
            };

            this.mockDb.Setup(d => d.GetBetsForUser("u1")).Returns(new List<MatchBet>(new MatchBet[36]));
            this.mockDb.Setup(d => d.GetGroups(true)).Returns(new[] { group });
            this.mockDb.Setup(d => d.GetGroupTeams("g1")).Returns(teams);
            foreach (var m in matches)
            {
                this.mockDb.Setup(d => d.GetBetForMatchAndUser(m, "u1")).Returns(bets[m.Id]);
            }

            var sut = this.CreateSut();
            var result = sut.CheckGroupMatchesAndGenerateTableResults("u1");

            Assert.True(result);
            // t2: 9 pts (3 wins), others: much less
            this.mockDb.Verify(d => d.UpsertGroupBet(It.Is<GroupBet>(gb =>
                gb.FirstId == "t2"
            )), Times.Once);
        }

        [Fact]
        public void CheckGroupMatchesAndGenerateTableResults_NotEnoughBets_ReturnsFalse()
        {
            this.mockDb.Setup(d => d.GetBetsForUser("u1")).Returns(new List<MatchBet>(new MatchBet[10]));

            var sut = this.CreateSut();
            var result = sut.CheckGroupMatchesAndGenerateTableResults("u1");

            Assert.False(result);
        }

        #endregion

        #region ConfirmBetsStatus (CanConfirmDelta)

        [Fact]
        public void ConfirmBetsStatus_DeltaCorrectCountNoDuplicates_Succeeds()
        {
            var deltaBets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "m1", HomeTeamBetId = "t1", AwayTeamBetId = "t2" },
                new DeltaBet { MatchId = "m2", HomeTeamBetId = "t3", AwayTeamBetId = "t4" },
                new DeltaBet { MatchId = "m3", HomeTeamBetId = "t5", AwayTeamBetId = "t6" },
                new DeltaBet { MatchId = "m4", HomeTeamBetId = "t7", AwayTeamBetId = "t8" }
            };
            var confirmedStatus = new BetsStatus();

            this.mockDb.Setup(d => d.GetDeltaBetsForUserAndStage(TournamentStage.Quarterfinal, "u1")).Returns(deltaBets);
            this.mockDb.Setup(d => d.GetBetsStatus("u1")).Returns(confirmedStatus);

            var sut = this.CreateSut();
            var result = sut.ConfirmBetsStatus(TournamentStage.Quarterfinal, "u1");

            Assert.NotNull(result);
            this.mockDb.Verify(d => d.ConfirmBetsStatus(TournamentStage.Quarterfinal, "u1"), Times.Once);
        }

        [Fact]
        public void ConfirmBetsStatus_DeltaDuplicateHomeTeams_ReturnsNull()
        {
            var deltaBets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "m1", HomeTeamBetId = "t1", AwayTeamBetId = "t2" },
                new DeltaBet { MatchId = "m2", HomeTeamBetId = "t1", AwayTeamBetId = "t4" },
                new DeltaBet { MatchId = "m3", HomeTeamBetId = "t5", AwayTeamBetId = "t6" },
                new DeltaBet { MatchId = "m4", HomeTeamBetId = "t7", AwayTeamBetId = "t8" }
            };

            this.mockDb.Setup(d => d.GetDeltaBetsForUserAndStage(TournamentStage.Quarterfinal, "u1")).Returns(deltaBets);

            var sut = this.CreateSut();
            var result = sut.ConfirmBetsStatus(TournamentStage.Quarterfinal, "u1");

            Assert.Null(result);
        }

        [Fact]
        public void ConfirmBetsStatus_DeltaWrongMatchCount_ReturnsNull()
        {
            var deltaBets = new List<DeltaBet>
            {
                new DeltaBet { MatchId = "m1", HomeTeamBetId = "t1", AwayTeamBetId = "t2" },
                new DeltaBet { MatchId = "m2", HomeTeamBetId = "t3", AwayTeamBetId = "t4" }
            };

            this.mockDb.Setup(d => d.GetDeltaBetsForUserAndStage(TournamentStage.Quarterfinal, "u1")).Returns(deltaBets);

            var sut = this.CreateSut();
            var result = sut.ConfirmBetsStatus(TournamentStage.Quarterfinal, "u1");

            Assert.Null(result);
        }

        #endregion
    }
}
