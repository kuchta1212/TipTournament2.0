namespace TipTournament2._0.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;

    public class WinnerResultCoordinator : IResultCoordinator
    {
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public WinnerResultCoordinator(IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }

        public void UploadNewResult<TResultType>(string matchId, TResultType result)
        {
            var teamId = result as string;

            var bets = this.dbContextWrapper.GetOmikronBets(true);
            var updateBets = this.betResultMaker.UpdateWinnerBets(bets, teamId);

            this.dbContextWrapper.UpdateOmikronBets(updateBets);

            this.RecalculatePoints();
        }

        public void RecalculatePoints()
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach (var user in users)
            {
                var betForUser = this.dbContextWrapper.GetTeamPlaceBet(user.Id, true);
                if (betForUser != null)
                {
                    user.DeltaPoints += betForUser.IsCorrect ? 3 : 0;
                    user.TotalPoints += betForUser.IsCorrect ? 3 : 0;
                }
            }

            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
