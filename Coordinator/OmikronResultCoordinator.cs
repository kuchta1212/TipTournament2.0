namespace TipTournament2._0.Coordinator
{
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    public class OmikronResultCoordinator : IResultCoordinator
    {
        private readonly IOptions<OmikronStageOptions> omikronStageOptions;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;
        private readonly GeneralOption generalConfig;

        public OmikronResultCoordinator(IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker, IOptions<OmikronStageOptions> omikronStageOptions, IOptions<GeneralOption> generalOption)
        {
            this.omikronStageOptions = omikronStageOptions;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
            this.generalConfig = generalOption.Value;
        }

        public void UploadNewResult<TResultType>(string id, TResultType r)
        {
            var teamIds = this.omikronStageOptions.Value.TeamIds;

            var results = this.GetResults(TournamentStage.FirstRound, TournamentStage.Group, teamIds.ToList<string>());
            if (results.Count < 3)
            {
                results.AddRange(this.GetResults(TournamentStage.Quarterfinal, TournamentStage.FirstRound, teamIds.ToList().Except(results.Select(r => r.teamId).ToList<string>()).ToList()));

                if (results.Count < 3)
                {
                    results.AddRange(this.GetResults(TournamentStage.Semifinal, TournamentStage.Quarterfinal, teamIds.ToList().Except(results.Select(r => r.teamId).ToList<string>()).ToList()));

                    if (results.Count < 3)
                    {
                        results.AddRange(this.GetResults(TournamentStage.Final, TournamentStage.Semifinal, teamIds.ToList().Except(results.Select(r => r.teamId).ToList<string>()).ToList()));

                        if (results.Count < 3)
                        {
                            results.AddRange(this.GetResults(TournamentStage.Semifinal, TournamentStage.Quarterfinal, teamIds.ToList().Except(results.Select(r => r.teamId).ToList<string>()).ToList()));

                            if (results.Count < 3)
                            {
                                results.AddRange(this.GetResults(TournamentStage.Final, TournamentStage.Semifinal, teamIds.ToList().Except(results.Select(r => r.teamId).ToList<string>()).ToList()));

                                if (results.Count < 3)
                                {
                                    var final = this.dbContextWrapper.GetMatchById(this.generalConfig.FinalMatchId);
                                    if (final.Result.IsHomeTeamWinner())
                                    {
                                        if (teamIds.Contains(final.HomeId))
                                        {
                                            results.Add(new SpecificTeamPlaceBet() { teamId = final.HomeId, StageBet = TournamentStage.Winner });
                                        }
                                        else if(teamIds.Contains(final.AwayId))
                                        {
                                            results.Add(new SpecificTeamPlaceBet() { teamId = final.HomeId, StageBet = TournamentStage.Final });
                                        }
                                    }
                                    else
                                    {
                                        if (teamIds.Contains(final.HomeId))
                                        {
                                            results.Add(new SpecificTeamPlaceBet() { teamId = final.HomeId, StageBet = TournamentStage.Final });
                                        }
                                        else if (teamIds.Contains(final.AwayId))
                                        {
                                            results.Add(new SpecificTeamPlaceBet() { teamId = final.HomeId, StageBet = TournamentStage.Winner });
                                        }
                                    }
                                       
                                }
                            }
                        }
                    }
                }
            }

            var bets = this.dbContextWrapper.GetOmikronBets(false);
            var updatedBets = this.betResultMaker.UpdateOmikronBets(bets, results);
            this.dbContextWrapper.UpdateOmikronBets(updatedBets);
            this.RecalculatePoints();

        }

        private List<SpecificTeamPlaceBet> GetResults(TournamentStage current, TournamentStage previous, List<string> teamIds)
        {
            var res = new List<SpecificTeamPlaceBet>();
            var roundMatches = this.dbContextWrapper.GetMatches(current);
            var roundResults = this.FoundInRound(roundMatches, teamIds.ToList());
            var ended = roundResults.Where(d => !d.Value).Select(kv => kv.Key);
            if (ended.Count() > 0)
            {
                foreach (var teamId in ended)
                {
                    res.Add(new SpecificTeamPlaceBet() { teamId = teamId, StageBet = previous });
                }
            }
            return res;
        }

        private Dictionary<string, bool> FoundInRound(List<Match> matches, List<string> teams)
        {
            var res = new Dictionary<string, bool>();
            foreach (var match in matches)
            {
                foreach(var team in teams)
                {
                    if (!res.ContainsKey(team))
                    {
                        res.Add(team, false);
                    }

                    if (match.HomeId == team)
                    {
                        res[team] = true;
                        break;
                    }

                    if (match.AwayId == team)
                    {
                        res[team] = true;
                    }
                }
            }
            return res;
        }

        private void RecalculatePoints()
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach (var user in users)
            {
                var betForUser = this.dbContextWrapper.GetTeamPlaceBet(user.Id, false);
                if(betForUser != null)
                {
                    user.OmikronPoints += betForUser.IsCorrect ? 3 : 0;
                    user.TotalPoints += betForUser.IsCorrect ? 3 : 0;
                }
            }

            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
