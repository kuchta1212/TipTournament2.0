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

    public class DeltaResultCoordinator : IResultCoordinator
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public DeltaResultCoordinator(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }

        public void UploadNewResult<TResult>(string matchId, TResult result)
        {
            var match = this.dbContextWrapper.GetMatchById(matchId);
            match.HomeId = (result as Tuple<string, string>).Item1;
            match.AwayId = (result as Tuple<string, string>).Item2;
            match.Ended = true;
            this.dbContextWrapper.UpdateMatch(match);
            if (match.Stage != TournamentStage.FirstRound)
            {
                this.UpdateDeltaBetsResults(match);
                this.RecalculatePoints(match.Id);
            }
        }

        private void UpdateDeltaBetsResults(Match match)
        {
            var bets = this.dbContextWrapper.GetDeltaBetsByMatchId(match.Id);
            var updateBets = this.betResultMaker.UpdateDeltaBetsResult(bets, match);
            this.dbContextWrapper.UpdateDeltaBets(updateBets);
        }

        private void RecalculatePoints(string matchId)
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach (var user in users)
            {
                var betForUser = this.dbContextWrapper.GetDeltaBetByMatchId(user.Id, matchId);
                user.DeltaPoints += betForUser.Result.Points;
                user.TotalPoints += betForUser.Result.Points;
            }

            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
