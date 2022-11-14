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

    public class GroupMatchesResultCoordinator : IResultCoordinator
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public GroupMatchesResultCoordinator(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }

        public void UploadNewResult<TResult>(string matchId, TResult result)
        {
            var dbResult = this.dbContextWrapper.SaveResult(result as Result);
            var match = this.dbContextWrapper.GetMatchById(matchId);
            match.Result = dbResult;
            match.Ended = true;
            this.dbContextWrapper.UpdateMatch(match);
            this.UpdateBetsResult(match);
            this.RecalculatePoints(match);
        }

        private void UpdateBetsResult(Match match)
        {
            var bets = this.dbContextWrapper.GetBetsForMatch(match);
            var updateBets = this.betResultMaker.UpdateBetResult(bets, match.Result);
            this.dbContextWrapper.UpdateBets(updateBets);
        }

        private void RecalculatePoints(Match match)
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach(var user in users)
            {
                var betForUser = this.dbContextWrapper.GetBetForMatchAndUser(match, user.Id);
                user.AlfaPoints += (int)betForUser.Result;
                user.TotalPoints += (int)betForUser.Result;
            }

            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
