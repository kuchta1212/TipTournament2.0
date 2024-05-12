namespace TipTournament2._0.Coordinator
{
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Sockets;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    public class DeltaResultCoordinator : IResultCoordinator
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;
        private readonly FeatureFlags featureFlags;

        public DeltaResultCoordinator(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker, IOptions<FeatureFlags> featureFlagsOptions)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
            this.featureFlags = featureFlagsOptions.Value;
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

                if(featureFlags.AdditionalDeltaEvaluation)
                {
                    this.AdditionalDeltaEvaluation(match);
                }
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
                if(betForUser != null)
                {
                    user.DeltaPoints += betForUser.Result.Points;
                    user.TotalPoints += betForUser.Result.Points;
                }
            }

            this.dbContextWrapper.UpdateUsers(users);
        }

        private void AdditionalDeltaEvaluation(Match match)
        {
            var bets = this.dbContextWrapper.GetDeltaBetByStage(match.Stage, match.Id);

            var updateBets = this.betResultMaker.UpdateAdditionalDeltaBetsResult(bets, match);
            
            if(updateBets.Count > 0)
            {
                this.dbContextWrapper.UpdateDeltaBets(updateBets);

                var users = new List<ApplicationUser>();
                foreach (var updatedBet in updateBets)
                {
                    var user = this.dbContextWrapper.GetUser(updatedBet.UserId);
                    user.DeltaPoints += updatedBet.Result.AdditionalResult.Points;
                    user.TotalPoints += updatedBet.Result.AdditionalResult.Points;

                    users.Add(user);
                }

                this.dbContextWrapper.UpdateUsers(users);
            }

        }
    }
}
