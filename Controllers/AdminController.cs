namespace TipTournament2._0.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    [ApiController]
    [Authorize]
    [Route("api/admin")]

    public class AdminController : Controller
    {
        private readonly IDbContextWrapper context;
        private readonly IMatchClient matchClient;
        private readonly IResultCoordinatorFactory resultCoordinatorFactory;
        private readonly ITeamGenerator teamGenerator;

        public AdminController(IDbContextWrapper context, IMatchClient matchClient, IResultCoordinatorFactory resultCoordinatorFactory, ITeamGenerator teamGenerator)
        {
            this.matchClient = matchClient;
            this.context = context;
            this.resultCoordinatorFactory = resultCoordinatorFactory;
            this.teamGenerator = teamGenerator;
        }

        [HttpGet]
        public AdminScreenModel Index()
        {
            return new AdminScreenModel()
            {
                Users = this.context.GetUsers()
            };            
        }

        [HttpPost("{userId}/payed")]
        public IActionResult UserPayed([FromRoute]string userId, bool payed)
        {
            this.context.SetUserPaymentInfo(userId, payed);
            return new OkResult();
        }

        //[HttpGet("matches/load")]
        //public async Task<IActionResult> ImportMatches()
        //{
        //    var matches = await this.matchClient.LoadMatches();
        //    this.context.SaveMatches(matches);

        //    return new OkObjectResult(matches.Count);
        //}

        //[HttpGet("matches/check")]
        //public async Task<IActionResult> CheckForUpdates()
        //{
        //    return new OkObjectResult(await this.resultCoordinatorFactory.C.Coordinate());
        //}
        
        [HttpPost("result")]
        public IActionResult UploadResult([FromQuery] string matchId, [FromBody] Result result)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Group).UploadNewResult(matchId, result);
            return new OkResult();
        }

        [HttpPost("group/result")]
        public IActionResult UploadGroupResult([FromQuery] string groupId, [FromBody] GroupResult result)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Group, true).UploadNewResult(groupId, result);
            return new OkResult();
        }

        [HttpGet("delta/teams")]
        public IActionResult GetPossibleTeams([FromQuery] string matchId, [FromQuery] TournamentStage stage)
        {
            return new OkObjectResult(this.teamGenerator.GenerateTeams(matchId, stage));
        }
        
        [HttpPost("match")]
        public IActionResult SetTeamsForMatch([FromQuery] string matchId, [FromQuery] string homeTeamId, [FromQuery] string awayTeamId)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.FirstRound).UploadNewResult(matchId, new Tuple<string, string>(homeTeamId, awayTeamId));
            return new OkResult();
        }

        [HttpPost("omikron")]
        public IActionResult EvaluateOmikron()
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Omikron).UploadNewResult<object>(string.Empty, new object());
            return new OkResult();
        }

        [HttpPost("winner")]
        public IActionResult SetWinner([FromQuery] string teamId)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Winner).UploadNewResult<string>("match_64", teamId);
            return new OkResult();
        }

        [HttpPost("shooter")]
        public IActionResult EvaluateShooter([FromQuery] string name)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Lambda).UploadNewResult<string>(string.Empty, name);
            return new OkResult();
        }
    }
}
