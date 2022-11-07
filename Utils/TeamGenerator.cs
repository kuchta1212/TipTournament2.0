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

        public DeltaBetTeams GenerateTeams(string matchId, bool isFirstRound, string userId)
        {
            return isFirstRound
                ? this.GenerateTeamsFirstRound(matchId, userId)
                : this.GenerateTeams(matchId, userId);
        }

        private DeltaBetTeams GenerateTeamsFirstRound(string matchId, string userId)
        {
            var matchOption = this.deltaStageOptions.Value.FirstRound.Where(f => f.MatchId == matchId).First();

            var result = new DeltaBetTeams
            {
                PossibleHomeTeams = new List<Team>() { this.dbContextWrapper.GetGroupBetByGroupId(matchOption.Groups.Winner, userId)?.First },
                PossibleAwayTeams = new List<Team>() { this.dbContextWrapper.GetGroupBetByGroupId(matchOption.Groups.Runner, userId)?.Second }
            };

            return result;
        }

        private DeltaBetTeams GenerateTeams(string matchId, string userId)
        {
            var matchOption = this.deltaStageOptions.Value.NextRounds.Where(f => f.MatchId == matchId).First();

            var homeTeamBetOptions = this.dbContextWrapper.GetDeltaBetByMatchId(userId, matchOption.Matches[0]);
            var awayTeamBetOptions = this.dbContextWrapper.GetDeltaBetByMatchId(userId, matchOption.Matches[1]);
            var result = new DeltaBetTeams()
            {
                PossibleHomeTeams = new List<Team>(new[] { homeTeamBetOptions?.HomeTeamBet, homeTeamBetOptions?.AwayTeamBet }),
                PossibleAwayTeams = new List<Team>(new[] { awayTeamBetOptions?.HomeTeamBet, awayTeamBetOptions?.AwayTeamBet })
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
            var deltaBet = this.dbContextWrapper.GetDeltaBetByMatchId(userId, "match_64");
            return new List<Team>() { deltaBet.HomeTeamBet, deltaBet.AwayTeamBet }.ToArray();
        }
    }
}
