namespace TipTournament2._0.Data
{
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    public class DbContextWrapper : IDbContextWrapper
    {
        private readonly ApplicationDbContext dbContext;

        public DbContextWrapper(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public List<MatchBet> GetAllBets()
        {
            return dbContext.Bets.ToList();
        }

        public List<MatchBet> GetBetsForUser(string userId)
        {
            return dbContext.Bets
                .Include(b => b.User)
                .Include(b => b.Match)
                .Include(b => b.Tip)
                .Where(b => b.User.Id == userId).ToList();
        }

        public List<Match> GetMatches()
        {
            var matches = dbContext.Matches
                .Include(m => m.Home)
                .Include(m => m.Away)
                .Include(m => m.Result)
                .ToList();
            return matches;
        }

        public List<Match> GetMatches(TournamentStage stage)
        {
            var matches = dbContext.Matches
                .Where(m => m.Stage == stage)
                .Include(m => m.Result)
                .Include(m => m.Home)
                .Include(m => m.Away)
                .ToList();
            return matches;
        }

        public ApplicationUser GetUser(string userId)
        {
            return this.dbContext.Players.FirstOrDefault(x => x.Id == userId);
        }

        public List<ApplicationUser> GetUsers()
        {
            return this.dbContext.Players.ToList();
        }

        public void SaveMatches(List<Match> matches)
        {
            this.dbContext.AddRange(matches);
            this.dbContext.SaveChanges();
        }

        public Result SaveResult(Result result)
        {
            try
            {
                this.dbContext.Add(result);
                this.dbContext.SaveChanges();
                return result;
            } catch(Exception ex)
            {
                throw ex;
            }

        }

        public void SetUserPaymentInfo(string userId, bool payed)
        {
            var user = this.GetUser(userId);
            user.Payed = payed;
            this.dbContext.Update(user);
            this.dbContext.SaveChanges();
        }

        public void UploadTips(Dictionary<string, Result> tips, string userId)
        {
            //var user = this.GetUser(userId);
            //bets.ForEach(b => b.User = user);
            //this.dbContext.AddRange(bets);
            //this.dbContext.SaveChanges();
        }

        public void UploadTip(Result tip, string matchId, string userId)
        {
            var user = this.GetUser(userId);
            var match = this.GetMatch(matchId);

            var existingBet = this.dbContext.Bets.Include(b => b.Tip).FirstOrDefault(b => b.Match.Id == matchId && b.User.Id == userId);
            if(existingBet != null)
            {
                var existingTip = existingBet.Tip;
                existingTip.HomeTeam = tip.HomeTeam;
                existingTip.AwayTeam = tip.AwayTeam;
                this.dbContext.Update(existingTip);
            }
            else
            {
                var bet = new MatchBet()
                {
                    Match = match,
                    Result = BetResult.NOTHING,
                    Tip = tip,
                    User = user
                };

                this.dbContext.Add(bet);
            }

            this.dbContext.SaveChanges();
        }

        public List<Match> GetNotEndedMatches()
        {
            return this.dbContext.Matches.Where(m => !m.Ended).ToList();
        }

        public List<MatchBet> GetBetsForMatch(Match match)
        {
            return this.dbContext.Bets
                .Include(b => b.Match)
                .Include(b => b.Tip)
                .Where(b => b.Match.Id == match.Id)
                .ToList();
        }

        public MatchBet GetBetForMatchAndUser(Match match, string userId)
        {
            return this.dbContext.Bets
                .Include(b => b.Match)
                .Include(b => b.Tip)
                .Include(b => b.User)
                .Where(b => b.Match.Id == match.Id)
                .Where(b => b.User.Id == userId)
                .FirstOrDefault();
        }

        public void UpdateBets(List<MatchBet> bets)
        {
            this.dbContext.UpdateRange(bets);
            this.dbContext.SaveChanges();
        }

        public List<ApplicationUser> GetAllUsers()
        {
            return this.dbContext.Players.ToList();
        }

        private Match GetMatch(string matchId)
        {
            return this.dbContext.Matches.FirstOrDefault(x => x.Id == matchId);
        }

        public void UpdateMatch(Match match)
        {
            this.dbContext.Update(match);
            this.dbContext.SaveChanges();
        }

        public void UpdateResult(Result result)
        {
            this.dbContext.Update(result);
            this.dbContext.SaveChanges();
        }

        public void UpdateUsers(List<ApplicationUser> users)
        {
            this.dbContext.UpdateRange(users);
            this.dbContext.SaveChanges();
        }

        public void StoreUpdateStatus(UpdateStatus updateStatus)
        {
            this.dbContext.Add(updateStatus);
            this.dbContext.SaveChanges();
        }

        public UpdateStatus GetLatestUpdateStatus()
        {
            return this.dbContext.UpdateStatuses.OrderByDescending(u => u.Date).FirstOrDefault();
        }

        public GroupBet GetGroupBetByGroupId(string groupId, string userId)
        {
            return this.dbContext.GroupBets
                .Where(gb => gb.GroupId == groupId)
                .Where(gb => gb.UserId == userId)
                .Include(gb => gb.First)
                .Include(gb => gb.Second)
                .Include(gb => gb.Third)
                .Include(gb => gb.Fourth)
                .Include(gb => gb.Result)
                .FirstOrDefault();
        }

        public Team[] GetGroupTeams(string groupId)
        {
            var group = this.dbContext.Groups
                .Where(g => g.Id == groupId)
                .Include(g => g.Matches)
                    .ThenInclude(m => m.Home)
                .Include(g => g.Matches)
                    .ThenInclude(m => m.Away)
                .FirstOrDefault();

            var teams = new List<Team>();

            if (group != null)
            {
                foreach (var match in group.Matches)
                {
                    if (!teams.Contains(match.Home))
                    {
                        teams.Add(match.Home);
                    }

                    if (!teams.Contains(match.Away))
                    {
                        teams.Add(match.Away);
                    }

                    if (teams.Count == 4)
                    {
                        break;
                    }
                }
            }

            return teams.ToArray();
        }

        public Group[] GetGroups(bool includeMatches = false)
        {
            return includeMatches
                ? this.dbContext.Groups.Include(g => g.Result).Include(g => g.Matches).ToArray()
                : this.dbContext.Groups.Include(g => g.Result).ToArray();
        }

        public Match GetMatchById(string matchId)
        {
            return this.dbContext.Matches
                .Where(m => m.Id == matchId)
                .Include(m => m.Result)
                .FirstOrDefault();
        }

        public void UploadGroupBet(GroupBet groupBet, string groupId, string userId)
        {
            var existing = this.dbContext.GroupBets
                .Where(gb => gb.GroupId == groupId && gb.UserId == groupBet.UserId)
                .FirstOrDefault();

            if(existing == null)
            {
                var gb = new GroupBet()
                {
                    GroupId = groupId,
                    UserId = userId,
                    FirstId = groupBet.First.Id,
                    SecondId = groupBet.Second.Id,
                    ThirdId = groupBet.Third.Id,
                    FourthId = groupBet.Fourth.Id
                };

                this.dbContext.GroupBets.Add(gb);
            }
            else
            {
                existing.FirstId = groupBet.First.Id;
                existing.SecondId = groupBet.Second.Id;
                existing.ThirdId = groupBet.Third.Id;
                existing.FourthId = groupBet.Fourth.Id;

                this.dbContext.Update(existing);
            }

            this.dbContext.SaveChanges();
        }

        public void UpsertGroupBet(GroupBet groupBet)
        {
            var existing = this.dbContext.GroupBets
                .Where(gb => gb.GroupId == groupBet.GroupId && gb.UserId == groupBet.UserId)
                .FirstOrDefault();

            if(existing == null)
            {
                this.dbContext.GroupBets.Add(groupBet);
            } 
            else
            {
                existing.FirstId = groupBet.FirstId;
                existing.SecondId = groupBet.SecondId;
                existing.ThirdId = groupBet.ThirdId;
                existing.FourthId = groupBet.FourthId;

                this.dbContext.Update(existing);
            }

            this.dbContext.SaveChanges();
        }

        public Group GetGroup(string groupId)
        {
           return this.dbContext.Groups.Where(g => g.Id == groupId).FirstOrDefault();
        }

        public DeltaBet GetDeltaBetByMatchId(string userId, string matchId)
        {
            return this.dbContext.DeltaBets
                .Where(db => db.User.Id == userId)
                .Where(db => db.Match.Id == matchId)
                .Include(db => db.HomeTeamBet)
                .Include(db => db.AwayTeamBet)
                .Include(db => db.Result)
                .Include(db => db.Result.AdditionalResult)
                .FirstOrDefault();
        }

        public Team[] GetDeltaTeams(string matchId)
        {
            var match = this.dbContext.Matches.Where(m => m.Id == matchId)
                .Include(m => m.Home)
                .Include(m => m.Away)
                .FirstOrDefault();

            var list = new List<Team>() { match.Home, match.Away };
            return list.ToArray();
        }

        public void UpsertDeltaBet(DeltaBet deltaBet, string matchId, string userId)
        {
            var current = this.GetDeltaBetByMatchId(userId, matchId);

            if(current == null)
            {
                var db = new DeltaBet()
                {
                    MatchId = matchId,
                    UserId = userId,
                };

                if (deltaBet.HomeTeamBet != null)
                {
                    db.HomeTeamBetId = deltaBet.HomeTeamBet.Id;
                }

                if (deltaBet.AwayTeamBet != null)
                {
                    db.AwayTeamBetId = deltaBet.AwayTeamBet.Id;
                }

                this.dbContext.DeltaBets.Add(db);
            }
            else
            {
                if (deltaBet.HomeTeamBet != null)
                {
                    current.HomeTeamBetId = deltaBet.HomeTeamBet.Id;
                }

                if (deltaBet.AwayTeamBet != null)
                {
                    current.AwayTeamBetId = deltaBet.AwayTeamBet.Id;
                }

                this.dbContext.Update(current);
            }


            this.dbContext.SaveChanges();
        }

        public List<DeltaBet> GetDeltaBetsForUserAndStage(TournamentStage stage, string userId)
        {
            var query = from db in this.dbContext.DeltaBets.Where(db => db.UserId == userId)
                        join match in this.dbContext.Matches.Where(m => m.Stage == stage)
                        on db.MatchId equals match.Id
                        select db;

            return query.ToList();
        }

        public BetsStatus GetBetsStatus(string userId)
        {
            return this.dbContext.BetsStatuses.Where(bs => bs.UserId == userId).FirstOrDefault();
        }

        public void ConfirmBetsStatus(TournamentStage stage, string userId)
        {
            var betsStatus = this.GetBetsStatus(userId);
            if(betsStatus == null)
            {
                betsStatus = new BetsStatus()
                {
                    UserId = userId,
                };
                betsStatus.ConfirmStage(stage);

                this.dbContext.Add(betsStatus);
            } 
            else
            {
                betsStatus.ConfirmStage(stage);
            }

            this.dbContext.SaveChanges();
        }

        public List<GroupBet> GetGroupBetsForUser(string userId)
        {
            return this.dbContext.GroupBets
                .Where(gb => gb.UserId == userId)
                .Include(gb => gb.Result)
                .ToList();
        }

        public SpecificTeamPlaceBet GetTeamPlaceBet(string userId, bool isWinnerBet)
        {
            return this.dbContext.TeamPlaceBets
                .Where(t => t.UserId == userId && t.IsWinnerBet == isWinnerBet)
                .Include(t => t.Team)
                .FirstOrDefault();
        }

        public void UpsertTeamPlaceBet(string teamId, string userId, bool isWinnerBet, TournamentStage stage)
        {
            var current = this.GetTeamPlaceBet(userId, isWinnerBet);

            if (current == null)
            {
                var teamPlaceBet = new SpecificTeamPlaceBet()
                {
                    UserId = userId,
                    teamId = teamId,
                    StageBet = stage,
                    IsWinnerBet = isWinnerBet
                };

                this.dbContext.Add(teamPlaceBet);
            }
            else
            {
                current.teamId = teamId;
                current.StageBet = stage;

                this.dbContext.Update(current);
            }

            this.dbContext.SaveChanges();
        }

        public Team GetTeam(string teamId)
        {
            return this.dbContext.Teams.Where(t => t.Id == teamId).FirstOrDefault();
        }

        public void UpsertShooterBet(string name, string userId)
        {
            var bet = this.GetShooterBet(userId);
            if(bet != null)
            {
                bet.ShoterName = name;
                this.dbContext.Update(bet);
            } 
            else
            {
                var shooterBet = new TopShooterBet()
                {
                    ShoterName = name,
                    UserId = userId
                };

                this.dbContext.Add(shooterBet);
            }

            this.dbContext.SaveChanges();
        }

        public TopShooterBet GetShooterBet(string userId)
        {
            return this.dbContext.TopShooterBets.Where(b => b.UserId == userId).FirstOrDefault();
        }

        public void ModifyBetsStatus(TournamentStage stage, string userId)
        {
            var betsStatus = this.GetBetsStatus(userId);
            if(betsStatus == null)
            {
                return;
            }

            betsStatus.ModifyStage(stage);
            this.dbContext.SaveChanges();
        }

        public Group GetGroupById(string groupId)
        {
            return this.dbContext.Groups
                .Where(g => g.Id == groupId)
                .Include(g => g.Result)
                .Include(g => g.Result.First)
                .Include(g => g.Result.Second)
                .Include(g => g.Result.Third)
                .FirstOrDefault();
        }

        public Group GetGroupResultByGroupId(string groupId)
        {
            return this.dbContext.Groups
                .Where(g => g.Id == groupId)
                .Include(g => g.Result)
                .Include(g => g.Result.First)
                .Include(g => g.Result.Second)
                .Include(g => g.Result.Third)
                .FirstOrDefault();
        }

        public GroupResult SaveResult(GroupResult result)
        {
            this.dbContext.Add(result);
            this.dbContext.SaveChanges();
            return result;
        }

        public void UpdateResult(GroupResult result)
        {
            this.dbContext.Update(result);
            this.dbContext.SaveChanges();
        }

        public void UpdateGroup(Group group)
        {
            this.dbContext.Update(group);
            this.dbContext.SaveChanges();
        }

        public List<DeltaBet> GetDeltaBetsByMatchId(string matchId)
        {
            return this.dbContext.DeltaBets
                .Where(d => d.MatchId == matchId)
                .Include(d => d.Result)
                .ToList();
        }

        public void UpdateDeltaBets(List<DeltaBet> updateBets)
        {
            this.dbContext.UpdateRange(updateBets);
            this.dbContext.SaveChanges();
        }

        public List<GroupBet> GetGroupBetsByGroupId(string groupId)
        {
            return this.dbContext.GroupBets
                .Where(d => d.GroupId == groupId)
                .Include(d => d.Result)
                .ToList();
        }

        public void UpdateGroupBets(List<GroupBet> updateBets)
        {
            this.dbContext.UpdateRange(updateBets);
            this.dbContext.SaveChanges();
        }

        public List<SpecificTeamPlaceBet> GetOmikronBets(bool isWinnerBet)
        {
            return this.dbContext.TeamPlaceBets.Where(b => b.IsWinnerBet == isWinnerBet).ToList();
        }

        public void UpdateOmikronBets(List<SpecificTeamPlaceBet> updatedBets)
        {
            this.dbContext.UpdateRange(updatedBets);
            this.dbContext.SaveChanges();
        }

        public List<TopShooterBet> GetShooterBets()
        {
            return this.dbContext.TopShooterBets.ToList();
        }

        public void UpdateLambdaBets(List<TopShooterBet> updateBets)
        {
            this.dbContext.UpdateRange(updateBets);
            this.dbContext.SaveChanges();
        }

        public List<DeltaBet> GetDeltaBetByStage(TournamentStage stage, string matchId)
        {
            var query = from db in this.dbContext.DeltaBets.Where(db => db.MatchId != matchId).Include(db => db.Result).Include(db => db.Result.AdditionalResult)
                        join match in this.dbContext.Matches.Where(m => m.Stage == stage)
                        on db.MatchId equals match.Id
                        select db;

            return query.ToList();
        }
    }
}
