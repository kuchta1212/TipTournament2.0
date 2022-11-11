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

    public class GroupResultCoordinator : IResultCoordinator
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public GroupResultCoordinator(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }

        public void UploadNewResult<TResult>(string groupId, TResult result)
        {
            var group = this.dbContextWrapper.GetGroupById(groupId);
            var savedResult = this.dbContextWrapper.SaveResult(result as GroupResult);
            group.Result = savedResult;
            this.dbContextWrapper.UpdateGroup(group);
            this.UpdateGroupBetsResults(group);
            this.RecalculatePoints(group.Id);
        }

        private void UpdateGroupBetsResults(Group group)
        {
            var bets = this.dbContextWrapper.GetGroupBetsByGroupId(group.Id);
            var updateBets = this.betResultMaker.UpdateGroupBetsResult(bets, group.Result);
            this.dbContextWrapper.UpdateGroupBets(updateBets);
        }

        private void RecalculatePoints(string groupId)
        {
            var users = this.dbContextWrapper.GetAllUsers();
            foreach (var user in users)
            {
                var betForUser = this.dbContextWrapper.GetGroupBetByGroupId(groupId, user.Id);
                user.GamaPoints += betForUser.Result.Points;
                user.TotalPoints += betForUser.Result.Points;
            }
            this.dbContextWrapper.UpdateUsers(users);
        }
    }
}
