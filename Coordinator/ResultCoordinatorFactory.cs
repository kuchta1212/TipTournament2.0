namespace TipTournament2._0.Coordinator
{
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Calculator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    public class ResultCoordinatorFactory : IResultCoordinatorFactory
    {
        private readonly IMatchClient matchClient;
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IBetResultMaker betResultMaker;
        private readonly IOptions<OmikronStageOptions> omikronStageOptions;
        private readonly IOptions<GeneralOption> generalOption;
        private readonly IOptions<FeatureFlags> featureFlags;

        public ResultCoordinatorFactory(IMatchClient matchClient, IDbContextWrapper dbContextWrapper, IBetResultMaker betResultMaker, IOptions<OmikronStageOptions> omikronStageOptions, IOptions<GeneralOption> generalOption, IOptions<FeatureFlags> featureFlagsOptions)
        {
            this.matchClient = matchClient;
            this.dbContextWrapper = dbContextWrapper;
            this.betResultMaker = betResultMaker;
            this.omikronStageOptions = omikronStageOptions;
            this.generalOption = generalOption;
            this.featureFlags = featureFlagsOptions;
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
                    return new DeltaResultCoordinator(this.matchClient, this.dbContextWrapper, this.betResultMaker, this.featureFlags);
                case TournamentStage.Winner:
                    return new WinnerResultCoordinator(this.dbContextWrapper, this.betResultMaker);
                case TournamentStage.Omikron:
                    return new OmikronResultCoordinator(this.dbContextWrapper, this.betResultMaker, this.omikronStageOptions, this.generalOption);
                case TournamentStage.Lambda:
                    return new LambdaResultCoordinator(this.dbContextWrapper, this.betResultMaker);
                default:
                    throw new NotSupportedException("Si se posral v kině");
            }
        }
    }
}
