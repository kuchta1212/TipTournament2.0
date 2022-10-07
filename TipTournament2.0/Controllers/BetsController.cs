
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

    [ApiController]
    [Authorize]
    [Route("api/bets")]

    public class BetsController : Controller
    {
        private readonly IDbContextWrapper context;

        public BetsController(IDbContextWrapper context)
        {
            this.context = context;
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

        [HttpGet("groups")]
        public IActionResult GetGroups()
        {
            return new OkObjectResult(this.context.GetGroups());
        }

        [HttpGet("group")]
        public IActionResult GetGroupBet([FromQuery] string groupId)
        {
            return new OkObjectResult(this.context.GetGroupBetByGroupId(this.GetUserId(), groupId));
        }

        [HttpGet("group/teams")]
        public IActionResult GetGroupTeams([FromQuery] string groupId)
        {
            return new OkObjectResult(this.context.GetGroupTeams(groupId));
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
