
namespace TipTournament2._0.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    [ApiController]
    [Authorize]
    [Route("api/bets")]

    public class BetsController : Controller
    {
        private readonly IDbContextWrapper context;
        private readonly ITeamGenerator teamGenerator;
        private readonly IBetGenerator betGenerator;

        public BetsController(IDbContextWrapper context, ITeamGenerator teamGenerator, IBetGenerator betGenerator)
        {
            this.context = context;
            this.teamGenerator = teamGenerator;
            this.betGenerator = betGenerator;
        }
        [HttpGet("")]
        public IActionResult GetBets()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpGet("{userId}")]
        public IActionResult GetBets([FromRoute] string userId)
        {
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.context.GetBetsStatus(userId));
        }

        [HttpGet("status/{stage}")]
        public IActionResult GetStageStatus([FromRoute] TournamentStage stage)
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.GetBetsStatus(stage, userId));
        }

        [HttpPost("status/{stage}/confirm")]
        public IActionResult ConfirmBetsStatus([FromRoute] TournamentStage stage)
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.ConfirmBetsStatus(stage, userId));
        }

        [HttpGet("groups")]
        public IActionResult GetGroups()
        {
            return new OkObjectResult(this.context.GetGroups());
        }

        [HttpGet("group")]
        public IActionResult GetGroupBet([FromQuery] string groupId)
        {
            return new OkObjectResult(this.context.GetGroupBetByGroupId(groupId, this.GetUserId()));
        }

        [HttpGet("delta")]
        public IActionResult GetDelaBet([FromQuery] string matchId)
        {
            return new OkObjectResult(this.context.GetDeltaBetByMatchId(this.GetUserId(), matchId));
        }

        [HttpGet("group/teams")]
        public IActionResult GetGroupTeams([FromQuery] string groupId)
        {
            return new OkObjectResult(this.context.GetGroupTeams(groupId));
        }

        [HttpGet("delta/teams")]
        public IActionResult GetDeltaTeams([FromQuery] string matchId, [FromQuery] TournamentStage stage)
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.teamGenerator.GenerateTeams(matchId, stage == TournamentStage.FirstRound, userId));
        }

        [HttpPost("generate/groupbet")]
        public IActionResult GenerateGroupBets()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.CheckGroupMatchesAndGenerateTableResults(userId));
        }

        [HttpPost("tip")]
        public IActionResult UploadTip([FromBody] UploadTipRequest request)
        {
            var userId = this.GetUserId();
            this.context.UploadTip(request.Tip, request.MatchId, userId);
            return new OkResult();
        }

        [HttpPost("group")]
        public IActionResult UploadGroupBet([FromBody] GroupBet groupBet, [FromQuery] string groupId)
        {
            var userId = this.GetUserId();
            this.context.UploadGroupBet(groupBet, groupId, userId);
            return new OkResult();
        }

        [HttpPost("delta")]
        public IActionResult UploadDeltaBet([FromBody] DeltaBet deltaBet, [FromQuery] string matchId)
        {
            var userId = this.GetUserId();
            this.context.UpsertDeltaBet(deltaBet, matchId, userId);
            return new OkResult();
        }

        [HttpPost("users")]
        public IActionResult GetBets([FromBody] string[] userIds)
        {
            var result = new Dictionary<string, MatchBet[]>();
            foreach (var userId in userIds)
            {
                var bets = this.context.GetBetsForUser(userId);
                result.Add(userId, bets.ToArray());
            }
            return new OkObjectResult(result);
        }


        private string GetUserId()
        {
            return this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
        }




    }
}
