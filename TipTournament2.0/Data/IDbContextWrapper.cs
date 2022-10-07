namespace TipTournament2._0.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IDbContextWrapper
    {
        List<Match> GetMatches();

        List<Match> GetMatches(TournamentStage stage);

        List<MatchBet> GetBetsForUser(string userId);

        List<ApplicationUser> GetUsers();

        List<MatchBet> GetAllBets();

        void UploadTips(Dictionary<string, Result> tips, string userId);

        void UploadTip(Result tip, string matchId, string userId);

        ApplicationUser GetUser(string userId);

        void SetUserPaymentInfo(string userId, bool payed);

        void SaveMatches(List<Match> matches);

        List<Match> GetNotEndedMatches();

        List<MatchBet> GetBetsForMatch(Match match);

        void UpdateBets(List<MatchBet> bets);

        List<ApplicationUser> GetAllUsers();

        Result SaveResult(Result result);

        void UpdateMatch(Match match);

        void UpdateResult(Result result);

        void UpdateUsers(List<ApplicationUser> users);

        void StoreUpdateStatus(UpdateStatus updateStatus);

        UpdateStatus GetLatestUpdateStatus();

        GroupBet GetGroupBetByGroupId(string userId, string groupId);

        Team[] GetGroupTeams(string groupId);

        Group[] GetGroups();

        void UploadGroupBet(GroupBet groupBet, string groupId, string userId);
    }
}
