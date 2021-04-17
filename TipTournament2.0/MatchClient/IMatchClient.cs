using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TipTournament2._0.Models;

namespace TipTournament2._0.MatchClient
{
    public interface IMatchClient
    {
        Task<List<Match>> LoadMatches();

        Task<Result> GetResult(Match match);

        Task<List<Match>> CheckForUpdates(List<Match> notEndedMatches);
    }
}
