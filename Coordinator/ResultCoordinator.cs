namespace TipTournament2._0.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;

    public class ResultCoordinator : IResultCoordinator
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public ResultCoordinator(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }

        public Task<int> Coordinate()
        {
            throw new NotImplementedException();
            //var matches = await this.LoadNewResults();
            //this.UpdateBetsResult(matches);
            //this.RecalculatePoints();
            //return matches.Count();
        }

        //private async Task<List<Match>> LoadNewResults()
        //{
        //    var notEndedMatches = this.dbContextWrapper.GetNotEndedMatches();
        //    var matchesWithResult = await this.matchClient.CheckForUpdates(notEndedMatches);

        //    var updateMatches = this.UpsertResults(matchesWithResult);

        //    return updateMatches.Where(m => m.Ended).ToList();
        //}

        public void UploadNewResult(string matchId, Result result)
        {
            var match = this.dbContextWrapper.GetMatchById(matchId);
            var dict = new Dictionary<Match, Result>();
            dict.Add(match, result);
            this.UpsertResults(dict);
            //this.RecalculatePoints();
        }

        private List<Match> UpsertResults(Dictionary<Match, Result> matchesWithResult)
        {
            foreach(var matchWithResult in matchesWithResult)
            {
                if(matchWithResult.Key.Result == null)
                {
                    var result = this.dbContextWrapper.SaveResult(matchWithResult.Value);
                    matchWithResult.Key.Result = result;
                }
                else
                {
                    this.dbContextWrapper.UpdateResult(matchWithResult.Value);
                }
                this.dbContextWrapper.UpdateMatch(matchWithResult.Key);
            }

            return matchesWithResult.Keys.ToList();
        }

        private void UpdateBetsResult(List<Match> matches)
        {
            foreach (var match in matches)
            {
                var bets = this.dbContextWrapper.GetBetsForMatch(match);
                var updateBets = this.betResultMaker.UpdateBetResult(bets, match.Result);
                this.dbContextWrapper.UpdateBets(updateBets);
            }
        }

        private void RecalculatePoints()
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach(var user in users)
            {
                var betsForUser = this.dbContextWrapper.GetBetsForUser(user.Id);
                var points = betsForUser.Sum(b => (int)b.Result);
                user.TotalPoints = points;                
            }

            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
