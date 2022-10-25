namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;

    public static class BetsStatusExtension
    {
        public static void ConfirmStage(this BetsStatus betsStatus, TournamentStage stage)
        {
            switch (stage) 
            {
                case TournamentStage.Group:
                    betsStatus.MatchesInGroupsDone = true;
                    betsStatus.GroupStagesDone = true;
                    break;
                case TournamentStage.Quarterfinal:
                    betsStatus.QuerterfinalStageDone = true;
                    break;
                case TournamentStage.Semifinal:
                    betsStatus.SemifinalStageDone = true;
                    break;
                case TournamentStage.Final:
                    betsStatus.FinalStageDone = true;
                    break;
            }
        }
    }
}
