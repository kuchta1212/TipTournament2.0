namespace TipTournament2._0.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;

    public class BetGenerator : IBetGenerator
    {
        private readonly IDbContextWrapper contextWrapper;
        private Dictionary<TournamentStage, int> countMap = new Dictionary<TournamentStage, int>()
        {
            { TournamentStage.Group, 48},
            { TournamentStage.FirstRound, 8},
            { TournamentStage.Quarterfinal, 4},
            { TournamentStage.Semifinal, 2}
        };

        public BetGenerator(IDbContextWrapper contextWrapper)
        {
            this.contextWrapper = contextWrapper;
        }

        public bool ReadyForStage(TournamentStage stage, string userId)
        {
            var lowerStage = this.GetLowerStage(stage);

            if(lowerStage == TournamentStage.Group && stage != lowerStage)
            {
                //checking for first round, its always ready, anyone from group can be there
                return true;
            }

            return this.CheckBetsForStage(lowerStage, userId);
        }

        private TournamentStage GetLowerStage(TournamentStage stage)
        {
            return stage == TournamentStage.Group
                ? stage
                : (TournamentStage)((int)stage - 1);
        }

        private bool CheckBetsForStage(TournamentStage stage, string userId)
        {
            if(stage == TournamentStage.Group)
            {
                //todo
                return false;
            }

            var deltaBets = this.contextWrapper.GetDeltaBetsForUserAndStage(stage, userId);
            var distinctDeltaBetCounts = deltaBets.Select(db => db.MatchId).Distinct().Count();

            return distinctDeltaBetCounts == this.countMap[stage];
        }
    }
}
