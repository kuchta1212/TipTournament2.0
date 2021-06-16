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
    [Route("api")]
    public class HomeController : Controller
    {
        private readonly IDbContextWrapper context;

        public HomeController(IDbContextWrapper context)
        {
            this.context = context;
        }

        [HttpGet("data")]
        public IActionResult GetData()
        {
            var userId = this.GetUserId();
            var screen = new HomeScreenModel()
            {
                Bets = this.context.GetBetsForUser(userId),
                Matches = this.context.GetMatches().OrderBy(m => m.StartTime).ToList(),
                Users = this.context.GetUsers().OrderByDescending(u => u.Points).ToList(),
                Status = this.context.GetLatestUpdateStatus()
            };

            return new OkObjectResult(screen);
        }

        [HttpGet("matches")]
        public IActionResult GetMatches() 
        {
            return new OkObjectResult(this.context.GetMatches().OrderBy(m => m.StartTime).ToList());
        }

        [HttpGet("bets")]
        public IActionResult GetBets()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpGet("bets/{userId}")]
        public IActionResult GetBets([FromRoute] string userId)
        {
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpPost("bets/users")]
        public IActionResult GetBets([FromBody] string[] userIds)
        {
            var result = new Dictionary<string, Bet[]>();
            foreach(var userId in userIds)
            {
                var bets = this.context.GetBetsForUser(userId);
                result.Add(userId, bets.ToArray());
            }
            return new OkObjectResult(result);
        }

        [HttpPost("tip")]
        public IActionResult UploadTip([FromBody] UploadTipRequest request)
        {
            var userId = this.GetUserId();
            this.context.UploadTip(request.Tip, request.MatchId, userId);
            return new OkResult();
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return new OkObjectResult(this.context.GetAllUsers().Select(u => UiUser.FromApplicationUser(u)).ToList());
        }

        [HttpGet("user/payed")]
        public IActionResult DidPayed()
        {
            var userId = this.GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                var user = this.context.GetUser(userId);
                return new OkObjectResult(user.Payed);
            }

            return new OkObjectResult(false);
        }

        [HttpGet("status")]
        public IActionResult GetUpdateStatus()
        {
            return new OkObjectResult(this.context.GetLatestUpdateStatus());
        }

        private string GetUserId()
        {
            return this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
        }
    }
}
