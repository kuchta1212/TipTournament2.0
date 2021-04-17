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

        public List<Bet> GetAllBets()
        {
            return dbContext.Bets.ToList();
        }

        public List<Bet> GetBetsForUser(string userId)
        {
            return dbContext.Bets
                .Include(b => b.User)
                .Where(b => b.User.Id == userId).ToList();
        }

        public List<Match> GetMatches()
        {
            return dbContext.Matches.ToList();
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

        public void SaveResults(List<Match> matchesWithResults)
        {
            this.dbContext.UpdateRange(matchesWithResults);
        }

        public void SetUserAsPayed(string userId)
        {
            var user = this.GetUser(userId);
            user.Payed = true;
            this.dbContext.Update(user);
        }

        public void UploadBets(List<Bet> bets, string userId)
        {
            var user = this.GetUser(userId);
            bets.ForEach(b => b.User = user);
            this.dbContext.AddRange(bets);
            this.dbContext.SaveChanges();
        }

        public List<Match> GetNotEndedMatches()
        {
            return this.dbContext.Matches.Where(m => !m.Ended).ToList();
        }

        public List<Bet> GetBetsForMatches(List<Match> matches)
        {
            return this.dbContext.Bets
                .Include(b => b.Match)
                .Include(b => b.Tip)
                .Where(b => matches.Contains(b.Match))
                .ToList();
        }

        public void UpdateBets(List<Bet> bets)
        {
            this.dbContext.UpdateRange(bets);
        }

        public List<ApplicationUser> GetAllUsers()
        {
            return this.dbContext.Players.ToList();
        }
    }
}
