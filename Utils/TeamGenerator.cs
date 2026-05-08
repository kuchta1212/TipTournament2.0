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
                case TournamentStage.RoundOf32:
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
                ? this.GenerateTeamsForR32(matchId)
                : this.GenerateTeamsForLaterRounds(matchId, userId);
        }

        // R32 is set directly by admin (no per-user prediction from group bets).
        // Return the actual match teams (one per side) so any consumer sees the real participants.
        private DeltaBetTeams GenerateTeamsForR32(string matchId)
        {
            var match = this.dbContextWrapper.GetMatchById(matchId);
            var home = new List<Team>();
            var away = new List<Team>();
            if (match?.HomeId != null) home.Add(this.dbContextWrapper.GetTeam(match.HomeId));
            if (match?.AwayId != null) away.Add(this.dbContextWrapper.GetTeam(match.AwayId));
            return new DeltaBetTeams { PossibleHomeTeams = home, PossibleAwayTeams = away };
        }

        // R16+: each side's options = union of (user's bet teams for the feeder) + (actual match teams of the feeder), deduped by team id.
        private DeltaBetTeams GenerateTeamsForLaterRounds(string matchId, string userId)
        {
            var matchOption = this.deltaStageOptions.Value.NextRounds.Where(f => f.MatchId == matchId).First();

            return new DeltaBetTeams
            {
                PossibleHomeTeams = this.GetCombinedFeederTeams(matchOption.Matches[0], userId),
                PossibleAwayTeams = this.GetCombinedFeederTeams(matchOption.Matches[1], userId)
            };
        }

        private List<Team> GetCombinedFeederTeams(string feederMatchId, string userId)
        {
            var seen = new HashSet<string>();
            var result = new List<Team>();

            var userBet = this.dbContextWrapper.GetDeltaBetByMatchId(userId, feederMatchId);
            if (userBet?.HomeTeamBet != null && seen.Add(userBet.HomeTeamBet.Id))
            {
                result.Add(userBet.HomeTeamBet);
            }
            if (userBet?.AwayTeamBet != null && seen.Add(userBet.AwayTeamBet.Id))
            {
                result.Add(userBet.AwayTeamBet);
            }

            var match = this.dbContextWrapper.GetMatchById(feederMatchId);
            if (match?.HomeId != null && seen.Add(match.HomeId))
            {
                result.Add(this.dbContextWrapper.GetTeam(match.HomeId));
            }
            if (match?.AwayId != null && seen.Add(match.AwayId))
            {
                result.Add(this.dbContextWrapper.GetTeam(match.AwayId));
            }

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
            var deltaBet = this.dbContextWrapper.GetDeltaBetByMatchId(userId, "match_104");
            return deltaBet == null
                ? new Team[0]
                : new List<Team>() { deltaBet.HomeTeamBet, deltaBet.AwayTeamBet }.ToArray();
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
