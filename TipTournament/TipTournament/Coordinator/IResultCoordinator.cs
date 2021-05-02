namespace TipTournament.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IResultCoordinator
    {
        Task<int> Coordinate();
    }
}
