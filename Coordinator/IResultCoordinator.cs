namespace TipTournament2._0.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IResultCoordinator
    {
        Task<int> Coordinate();

        void UploadNewResult(string matchId, Result result);
    }
}
