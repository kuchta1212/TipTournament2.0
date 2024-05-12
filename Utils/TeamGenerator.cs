namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;
    using Microsoft.Extensions.Options;
    using TipTournament2._0.Data;

    public class TeamGenerator : ITeamGenerator
    {
        private readonly IOptions<DeltaStageOptions> deltaStageOptions;
        private readonly IOptions<OmikronStageOptions> omikronStageOptions;
        private readonly IDbContextWrapper dbContextWrapper;

        public TeamGenerator(IOptions<DeltaStageOptions> deltaStageOptions, IOptions<OmikronStageOptions> omikronStageOptions, IDbContextWrapper dbContextWrapper)
        {
            this.deltaStageOptions = deltaStageOptions;
            this.dbContextWrapper = dbContextWrapper;
            this.omikronStageOptions = omikronStageOptions;
        }

        public DeltaBetTeams GenerateTeams(string matchId, TournamentStage stage)
        {
            switch(stage)
            {
                case TournamentStage.FirstRound:
                    return this.GenerateTeamsFirstRound(matchId);
                case TournamentStage.Winner:
                    return this.GenerateTeamsWinner(matchId);
                default:
                    return this.GenerateTeams(matchId);
            }
        }

        public DeltaBetTeams GenerateTeams(string matchId, bool isFirstRound, string userId)
        {
            return isFirstRound
                ? this.GenerateTeamsFirstRound(matchId, userId)
                : this.GenerateTeams(matchId, userId);
        }

        private DeltaBetTeams GenerateTeamsFirstRound(string matchId, string userId)
        {
            var matchOption = this.deltaStageOptions.Value.FirstRound.Where(f => f.MatchId == matchId).First();

            var possibleHomeTeams = this.GetPossibleTeamsByTeamOption(matchOption.Home, userId);
            var possibleAwayTeams = this.GetPossibleTeamsByTeamOption(matchOption.Away, userId);


            return new DeltaBetTeams
            {
                PossibleHomeTeams = possibleHomeTeams,
                PossibleAwayTeams = possibleAwayTeams
            };
        }

        private DeltaBetTeams GenerateTeams(string matchId, string userId)
        {
            var matchOption = this.deltaStageOptions.Value.NextRounds.Where(f => f.MatchId == matchId).First();

            var homeTeamBetOptions = this.dbContextWrapper.GetDeltaBetByMatchId(userId, matchOption.Matches[0]);
            var awayTeamBetOptions = this.dbContextWrapper.GetDeltaBetByMatchId(userId, matchOption.Matches[1]);
            if (homeTeamBetOptions == null || awayTeamBetOptions == null)
            {
                return new DeltaBetTeams() { PossibleAwayTeams = new List<Team>(), PossibleHomeTeams = new List<Team>() };
            }

            var result = new DeltaBetTeams()
            {
                PossibleHomeTeams = new List<Team>(new[] { homeTeamBetOptions?.HomeTeamBet ?? new Team(), homeTeamBetOptions?.AwayTeamBet ?? new Team() }),
                PossibleAwayTeams = new List<Team>(new[] { awayTeamBetOptions?.HomeTeamBet ?? new Team(), awayTeamBetOptions?.AwayTeamBet ?? new Team() })
            };

            return result;
        }

        private DeltaBetTeams GenerateTeamsFirstRound(string matchId)
        {
            var matchOption = this.deltaStageOptions.Value.FirstRound.Where(f => f.MatchId == matchId).First();

            var possibleHomeTeams = this.GetPossibleTeamsByTeamOption(matchOption.Home);
            var possibleAwayTeams = this.GetPossibleTeamsByTeamOption(matchOption.Away);
            if (possibleHomeTeams == null || possibleAwayTeams == null)
            {
                return new DeltaBetTeams() { PossibleAwayTeams = new List<Team>(), PossibleHomeTeams = new List<Team>() };
            }

            var result = new DeltaBetTeams
            {
                PossibleHomeTeams = possibleHomeTeams,
                PossibleAwayTeams = possibleAwayTeams
            };

            return result;
        }

        private DeltaBetTeams GenerateTeams(string matchId)
        {
            var matchOption = this.deltaStageOptions.Value.NextRounds.Where(f => f.MatchId == matchId).First();

            var homeMatch = this.dbContextWrapper.GetMatchById(matchOption.Matches[0]);
            var awayMatch = this.dbContextWrapper.GetMatchById(matchOption.Matches[1]);

            if (homeMatch.HomeId == null|| homeMatch.AwayId == null || awayMatch.HomeId == null || awayMatch.AwayId == null )
            {
                return new DeltaBetTeams() { PossibleAwayTeams = new List<Team>(), PossibleHomeTeams = new List<Team>() };
            }

            var result = new DeltaBetTeams()
            {
                PossibleHomeTeams = new List<Team>(new[] { this.dbContextWrapper.GetTeam(homeMatch.HomeId), this.dbContextWrapper.GetTeam(homeMatch.AwayId) }),
                PossibleAwayTeams = new List<Team>(new[] { this.dbContextWrapper.GetTeam(awayMatch.HomeId), this.dbContextWrapper.GetTeam(awayMatch.AwayId) })
            };

            return result;
        }

        private DeltaBetTeams GenerateTeamsWinner(string matchId)
        {
            var match = this.dbContextWrapper.GetMatchById(matchId);

            if (match.HomeId == null || match.AwayId == null)
            {
                return new DeltaBetTeams() { PossibleAwayTeams = new List<Team>(), PossibleHomeTeams = new List<Team>() };
            }

            var result = new DeltaBetTeams
            {
                PossibleHomeTeams = new List<Team>() { this.dbContextWrapper.GetTeam(match.HomeId) },
                PossibleAwayTeams = new List<Team>() { this.dbContextWrapper.GetTeam(match.AwayId) }
            };

            return result;
        }

        public Team[] GenerateSpecificBetTeams()
        {
            var result = new List<Team>();

            var teamIds = this.omikronStageOptions.Value.TeamIds;
            foreach(var teamId in teamIds)
            {
                var team = this.dbContextWrapper.GetTeam(teamId);
                result.Add(team);
            }

            return result.ToArray();
        }

        public Team[] GetFinalists(string userId)
        {
            var deltaBet = this.dbContextWrapper.GetDeltaBetByMatchId(userId, "match_51");
            return deltaBet == null
                ? new Team[0]
                : new List<Team>() { deltaBet.HomeTeamBet, deltaBet.AwayTeamBet }.ToArray();
        }

        private List<Team> GetPossibleTeamsByTeamOption(TeamOption teamOption, string userId)
        {
            var result = new List<Team>();
            if (teamOption.Type == TeamOptionType.Winner || teamOption.Type == TeamOptionType.Runner)
            {
                var groupBetResult = this.dbContextWrapper.GetGroupBetByGroupId(teamOption.GroupId, userId);
                
                switch (teamOption.Type)
                {
                    case TeamOptionType.Winner:
                        result.Add(groupBetResult.First);
                        break;
                    case TeamOptionType.Runner:
                        result.Add(groupBetResult.Second);
                        break;
                    default:
                        break;
                }
            }
            else
            {
                foreach (var groupId in teamOption.GroupIds)
                {
                    var groupBetResult = this.dbContextWrapper.GetGroupBetByGroupId(groupId, userId);
                    result.Add(groupBetResult.Third);
                }
            }

            return result;
        }

        private List<Team> GetPossibleTeamsByTeamOption(TeamOption teamOption)
        {
            var result = new List<Team>();
            if (teamOption.Type == TeamOptionType.Winner || teamOption.Type == TeamOptionType.Runner)
            {
                var groupResult = this.dbContextWrapper.GetGroupById(teamOption.GroupId).Result;
                if (groupResult == null)
                {
                    return new List<Team>();
                }

                switch (teamOption.Type)
                {
                    case TeamOptionType.Winner:
                        result.Add(groupResult.First);
                        break;
                    case TeamOptionType.Runner:
                        result.Add(groupResult.Second);
                        break;
                    default:
                        break;
                }
            }
            else
            {
                foreach (var groupId in teamOption.GroupIds)
                {
                    var groupResult = this.dbContextWrapper.GetGroupById(groupId).Result;
                    if (groupResult != null)
                    {
                        result.Add(groupResult.Third);
                    }
                }
            }

            return result;
        }
    }
}
