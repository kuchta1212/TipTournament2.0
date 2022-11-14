namespace TipTournament2._0.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;

    public class LambdaResultCoordinator : IResultCoordinator
    {
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public LambdaResultCoordinator(IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }

        public void UploadNewResult<TResultType>(string id, TResultType result)
        {
            var bets = this.dbContextWrapper.GetShooterBets();
            var updateBets = this.betResultMaker.UpdateLambdaResults(bets, result as string);
            this.dbContextWrapper.UpdateLambdaBets(updateBets);
            this.RecalculatePoints();
        }

        public void RecalculatePoints()
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach (var user in users)
            {
                var betForUser = this.dbContextWrapper.GetShooterBet(user.Id);
                user.LambdaPoints += betForUser.Points;
                user.TotalPoints += betForUser.Points;
            }

            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
