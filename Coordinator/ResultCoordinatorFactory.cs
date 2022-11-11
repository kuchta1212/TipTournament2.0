namespace TipTournament2._0.Coordinator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;

    public class ResultCoordinatorFactory : IResultCoordinatorFactory
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;

        public ResultCoordinatorFactory(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
        }
        public IResultCoordinator Create(TournamentStage stage, bool noMatches)
        {
            switch (stage)
            {
                case TournamentStage.Group:
                    if(noMatches)
                    {
                        return new GroupResultCoordinator(this.matchClient, this.dbContextWrapper, this.betResultMaker);
                    }
                    return new GroupMatchesResultCoordinator(this.matchClient, this.dbContextWrapper, this.betResultMaker);
                case TournamentStage.FirstRound:
                case TournamentStage.Quarterfinal:
                case TournamentStage.Semifinal:
                case TournamentStage.Final:
                    return new DeltaResultCoordinator(this.matchClient, this.dbContextWrapper, this.betResultMaker);
                default:
                    throw new NotSupportedException("Si se posral v kině");
            }
        }
    }
}
