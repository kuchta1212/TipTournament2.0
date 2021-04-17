namespace TipTournament2._0.MatchClient
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IMatchClient
    {
        Task<List<Match>> LoadMatches();

        Task<Result> GetResult(Match match);

        Task<List<Match>> CheckForUpdates(List<Match> notEndedMatches);
    }
}
