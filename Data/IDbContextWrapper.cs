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

        MatchBet GetBetForMatchAndUser(Match match, string userId);

        void UpdateBets(List<MatchBet> bets);

        List<ApplicationUser> GetAllUsers();
        BetsStatus GetBetsStatus(string userId);
        Result SaveResult(Result result);

        void UpdateMatch(Match match);

        void UpdateResult(Result result);

        void UpdateUsers(List<ApplicationUser> users);

        void StoreUpdateStatus(UpdateStatus updateStatus);

        UpdateStatus GetLatestUpdateStatus();

        GroupBet GetGroupBetByGroupId(string groupId, string userId);
        List<DeltaBet> GetDeltaBetsByMatchId(string id);
        List<GroupBet> GetGroupBetsForUser(string userId);
        void UpdateDeltaBets(List<DeltaBet> updateBets);
        Team[] GetGroupTeams(string groupId);

        Group[] GetGroups(bool includeMatches = false);

        void UploadGroupBet(GroupBet groupBet, string groupId, string userId);
        
        Match GetMatchById(string matchId);

        void UpsertGroupBet(GroupBet groupBet);

        DeltaBet GetDeltaBetByMatchId(string userId, string matchId);

        Team[] GetDeltaTeams(string matchId);

        void UpsertDeltaBet(DeltaBet deltaBet, string matchId, string userId);

        Group GetGroupById(string groupId);

        List<DeltaBet> GetDeltaBetsForUserAndStage(TournamentStage stage, string userId);
        List<GroupBet> GetGroupBetsByGroupId(string id);
        GroupResult SaveResult(GroupResult result);

        void ConfirmBetsStatus(TournamentStage stage, string userId);
        void UpdateGroupBets(List<GroupBet> updateBets);
        void ModifyBetsStatus(TournamentStage stage, string userId);

        void UpdateResult(GroupResult result);

        void UpdateGroup(Group group);

        SpecificTeamPlaceBet GetTeamPlaceBet(string userId, bool isWinnerBet);

        void UpsertTeamPlaceBet(string teamId, string userId, bool isWinnerBet, TournamentStage stage);

        Team GetTeam(string teamId);

        void UpsertShooterBet(string name, string userId);

        TopShooterBet GetShooterBet(string userId);
    }
}
