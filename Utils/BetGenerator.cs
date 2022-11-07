namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;

    public class BetGenerator : IBetGenerator
    {
        private readonly IDbContextWrapper contextWrapper;
        private readonly ITeamGenerator teamGenerator;
        private Dictionary<TournamentStage, int> countMap = new Dictionary<TournamentStage, int>()
        {
            { TournamentStage.Group, 48},
            { TournamentStage.FirstRound, 8},
            { TournamentStage.Quarterfinal, 4},
            { TournamentStage.Semifinal, 2},
            { TournamentStage.Final, 1 }
        };

        public BetGenerator(IDbContextWrapper contextWrapper, ITeamGenerator teamGenerator)
        {
            this.contextWrapper = contextWrapper;
            this.teamGenerator = teamGenerator;
        }

        public BetsStageStatus GetBetsStatus(TournamentStage stage, string userId)
        {
            var lowerStage = this.GetLowerStage(stage);

            var betsStatus = this.contextWrapper.GetBetsStatus(userId);
            if(betsStatus == null)
            {
                return BetsStageStatus.NotReady;
            }


            return this.CheckBetsForStage(lowerStage, stage, betsStatus);
        }

        public BetsStatus ConfirmBetsStatus(TournamentStage stage, string userId)
        {
            if(this.CanConfirm(stage, userId))
            {
                this.contextWrapper.ConfirmBetsStatus(stage, userId);

                if (stage == TournamentStage.Group)
                {
                    this.GenerateFirstRound(userId);
                }

                return this.contextWrapper.GetBetsStatus(userId);
            }

            return null;
        }

        public BetsStatus ModifyBetsStatus(TournamentStage stage, string userId)
        {
            this.contextWrapper.ModifyBetsStatus(stage, userId);

            return this.contextWrapper.GetBetsStatus(userId);
        }

        public bool CheckGroupMatchesAndGenerateTableResults(string userId)
        {
            if(!this.CanConfirmGroupMatches(userId))
            {
                return false;
            }

            var groups = this.contextWrapper.GetGroups(true);

            foreach (var group in groups)
            {
                if(!this.CreateGroupBet(group, userId))
                {
                    return false;
                }
            }

            return true;
        }

        private void GenerateFirstRound(string userId)
        {
            var matches =  this.contextWrapper.GetMatches(TournamentStage.FirstRound);
            foreach (var match in matches)
            {
                var teams = this.teamGenerator.GenerateTeams(match.Id, true, userId);
                var deltaBet = new DeltaBet()
                {
                    HomeTeamBet = teams.PossibleHomeTeams.First(),
                    AwayTeamBet = teams.PossibleAwayTeams.First(),
                };
                this.contextWrapper.UpsertDeltaBet(deltaBet, match.Id, userId);
            }
        }

        private bool CanConfirm(TournamentStage stage, string userId)
        {
            switch (stage)
            {
                case TournamentStage.Group:
                    return this.CanConfirmGroupStage(userId);
                case TournamentStage.Winner:
                    return this.CanConfirmWinner(userId);
                case TournamentStage.Lambda:
                case TournamentStage.Omikron:
                    return true;
                default:
                    return this.CanConfirmDelta(stage, userId);
            }
        }

        private bool CanConfirmWinner(string userId)
        {
            var bet = this.contextWrapper.GetTeamPlaceBet(userId, true);
            return bet != null;
        }

        private bool CanConfirmGroupMatches(string userId)
        {
            var bets = this.contextWrapper.GetBetsForUser(userId);
            return bets.Count == countMap[TournamentStage.Group];
        }

        private bool CanConfirmGroupStage(string userId)
        {
            var canConfirm = this.CanConfirmGroupMatches(userId);
            var groupBets = this.contextWrapper.GetGroupBetsForUser(userId);
            return canConfirm && groupBets.Count == 8;
        }

        private bool CanConfirmDelta(TournamentStage stage, string userId)
        {
            var deltaBets = this.contextWrapper.GetDeltaBetsForUserAndStage(stage, userId);
            var distinctDeltaBetCounts = deltaBets.Select(db => db.MatchId).Distinct().Count();

            return distinctDeltaBetCounts == this.countMap[stage];
        }

        private TournamentStage GetLowerStage(TournamentStage stage)
        {
            return stage == TournamentStage.Group
                ? stage
                : (TournamentStage)((int)stage - 1);
        }

        private BetsStageStatus CheckBetsForStage(TournamentStage lower, TournamentStage actual, BetsStatus betsStatus)
        {
            switch(actual)
            {
                case TournamentStage.Group:
                    return betsStatus.MatchesInGroupsDone ? BetsStageStatus.Done : BetsStageStatus.Ready;
                case TournamentStage.FirstRound:
                    return betsStatus.GroupStagesDone ? BetsStageStatus.Done : BetsStageStatus.NotReady;
                case TournamentStage.Quarterfinal:
                    return betsStatus.GroupStagesDone ? betsStatus.QuerterfinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
                case TournamentStage.Semifinal:
                    return betsStatus.QuerterfinalStageDone ? betsStatus.SemifinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
                case TournamentStage.Final:
                    return betsStatus.SemifinalStageDone ? betsStatus.FinalStageDone ? BetsStageStatus.Done : BetsStageStatus.Ready : BetsStageStatus.NotReady;
                case TournamentStage.Winner:
                    return betsStatus.FinalStageDone ? BetsStageStatus.Ready : BetsStageStatus.NotReady;
                default:
                    return BetsStageStatus.NotReady;
            }
        }

        private bool CreateGroupBet(Group group, string userId)
        {
            var teams = this.contextWrapper.GetGroupTeams(group.Id);

            var result = new Dictionary<string, int>();

            foreach(var match in group.Matches)
            {
                if (!result.ContainsKey(match.Home.Id))
                {
                    result.Add(match.Home.Id, 0);
                }

                if (!result.ContainsKey(match.Away.Id))
                {
                    result.Add(match.Away.Id, 0);
                }

                var matchBet = this.contextWrapper.GetBetForMatchAndUser(match, userId);
                if (matchBet == null)
                {
                    return false;
                }

                if (matchBet.Tip.IsTie())
                {
                    result[match.Home.Id]++;
                    result[match.Away.Id]++;
                } 
                else if(matchBet.Tip.IsHomeTeamWinner())
                {
                    result[match.Home.Id] = result[match.Home.Id] + 3;
                } 
                else
                {
                    result[match.Away.Id] = result[match.Away.Id] + 3;
                }
            }

            var sort = result.OrderByDescending(kv => kv.Value);

            var groupBet = new GroupBet()
            {
                GroupId = group.Id,
                UserId = userId,
                FirstId = sort.ElementAt(0).Key,
                SecondId = sort.ElementAt(1).Key,
                ThirdId = sort.ElementAt(2).Key,
                FourthId = sort.ElementAt(3).Key
            };

            this.contextWrapper.UpsertGroupBet(groupBet);
            return true;
        }
    }
}
