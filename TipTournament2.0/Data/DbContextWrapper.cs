using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TipTournament2._0.Models;

namespace TipTournament2._0.Data
{
    public class DbContextWrapper : IDbContextWrapper
    {
        public Task<List<Bet>> GetAllBets()
        {
            throw new NotImplementedException();
        }

        public Task<List<Bet>> GetBetsForUser(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Match>> GetMatches()
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationUser> GetUser(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ApplicationUser>> GetUsers()
        {
            throw new NotImplementedException();
        }

        public Task SaveMatches(List<Match> matches)
        {
            throw new NotImplementedException();
        }

        public Task SaveResults(Dictionary<Match, Result> results)
        {
            throw new NotImplementedException();
        }

        public Task SetUserAsPayed(string userId)
        {
            throw new NotImplementedException();
        }

        public Task UploadBetsForUser(List<Bet> bets, string userId)
        {
            throw new NotImplementedException();
        }
    }
}
