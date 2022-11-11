namespace TipTournament2._0.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IResultCoordinatorFactory
    {
        IResultCoordinator Create(TournamentStage stage, bool noMatches = false);
    }
}
