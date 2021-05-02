namespace TipTournament.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament.Calculator;
    using TipTournament.Data;
    using TipTournament.MatchClient;
    using TipTournament.Models;

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

        public async Task<int> Coordinate()
        {
            var matches = await this.LoadNewResults();
            this.UpdateBetsResult(matches);
            this.RecalculatePoints();
            return matches.Count();
        }

        private async Task<List<Match>> LoadNewResults()
        {
            var notEndedMatches = this.dbContextWrapper.GetNotEndedMatches();
            var matchesWithResult = await this.matchClient.CheckForUpdates(notEndedMatches);
            this.dbContextWrapper.SaveResults(matchesWithResult);
            return matchesWithResult.Where(m => m.Ended).ToList();
        }

        private void UpdateBetsResult(List<Match> matches)
        {
            var bets = this.dbContextWrapper.GetBetsForMatches(matches);
            var updateBets = this.betResultMaker.UpdateBetResult(bets);
            this.dbContextWrapper.UpdateBets(updateBets);
        }

        private void RecalculatePoints()
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach(var user in users)
            {
                var betsForUser = this.dbContextWrapper.GetBetsForUser(user.Id);
                var points = betsForUser.Sum(b => (int)b.Result);
                user.Points = points;
            }
        }
    }
}
