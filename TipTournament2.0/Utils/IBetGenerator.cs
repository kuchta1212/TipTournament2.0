namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public interface IBetGenerator
    {
        BetsStageStatus GetBetsStatus(TournamentStage stage, string userId);

        BetsStatus ConfirmBetsStatus(TournamentStage stage, string userId);

        bool CheckGroupMatchesAndGenerateTableResults(string userId);
    }
}
