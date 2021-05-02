namespace TipTournament.MatchClient
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament.Models;

    public interface IMatchClient
    {
        Task<List<Match>> LoadMatches();

        Task<Result> GetResult(Match match);

        Task<List<Match>> CheckForUpdates(List<Match> notEndedMatches);
    }
}
