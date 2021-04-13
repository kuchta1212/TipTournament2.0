using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TipTournament2._0.Models;

namespace TipTournament2._0.Data
{
    public interface IDbContextWrapper
    {
        Task<List<Match>> GetMatches();

        Task<List<Bet>> GetBetsForUser(string userId);

        Task<List<ApplicationUser>> GetUsers();

        Task<List<Bet>> GetAllBets();

        Task UploadBetsForUser(List<Bet> bets, string userId);

        Task<ApplicationUser> GetUser(string userId);

        Task SetUserAsPayed(string userId);

        Task SaveMatches(List<Match> matches);

        Task SaveResults(Dictionary<Match, Result> results);
    }
}
