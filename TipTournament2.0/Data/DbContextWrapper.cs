namespace TipTournament2._0.Data
{
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

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

        public GroupBet GetGroupBetByGroupId(string userId, string groupId)
        {
            return this.dbContext.GroupBets
                .Where(gb => gb.Group.Id == groupId)
                .Where(gb => gb.User.Id == userId)
                .Include(gb => gb.First)
                .Include(gb => gb.Second)
                .Include(gb => gb.Third)
                .Include(gb => gb.Fourth)
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

        public Group[] GetGroups()
        {
            return this.dbContext.Groups.ToArray();
        }

        public void UploadGroupBet(GroupBet groupBet, string groupId, string userId)
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

        public void UploadDeltaBet(DeltaBet deltaBet, string matchId, string userId)
        {
            var db = new DeltaBet()
            {
                MatchId = matchId,
                UserId = userId,
                HomeTeamBetId = deltaBet.HomeTeamBet.Id,
                AwayTeamBetId = deltaBet.AwayTeamBet.Id
            };

            this.dbContext.DeltaBets.Add(db);

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
    }
}
