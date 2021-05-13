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
            var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            var matches = this.context.GetMatches();
            var testBets = new List<Bet>()
            {
                new Bet()
                {
                    Id = Guid.NewGuid().ToString(),
                    Match = matches[0],
                    Tip = new Result()
                    {
                        HomeTeam = 2,
                        AwayTeam = 1
                    }
                },
                new Bet()
                {
                    Id = Guid.NewGuid().ToString(),
                    Match = matches[1],
                    Tip = new Result()
                    {
                        HomeTeam = 1,
                        AwayTeam = 1
                    }
                },
                new Bet()
                {
                    Id = Guid.NewGuid().ToString(),
                    Match = matches[2],
                    Tip = new Result()
                    {
                        HomeTeam = 2,
                        AwayTeam = 2
                    }
                },
                new Bet()
                {
                    Id = Guid.NewGuid().ToString(),
                    Match = matches[3],
                    Tip = new Result()
                    {
                        HomeTeam = 2,
                        AwayTeam = 3
                    }
                }
            };

            var screen = new HomeScreenModel()
            {
                Bets = testBets,  //this.context.GetBetsForUser(userId),
                Matches = matches,
                Users = this.context.GetUsers()
            };

            return new OkObjectResult(screen);
        }

        [HttpGet("matches")]
        [AllowAnonymous]
        public IActionResult GetMatches() 
        {
            return new OkObjectResult(this.context.GetMatches());
        }

        [HttpGet("bets/all")]
        public Dictionary<ApplicationUser, IEnumerable<Bet>> GetAllBets()
        {
            var bets = this.context.GetAllBets();
            var users = this.context.GetUsers();

            return users.Select(x => new { key = x, value = bets.Where(b => b.User == x) }).ToDictionary(e => e.key, e => e.value);
        }

        [HttpPost("bets")]
        public void UploadBets([FromBody]List<Bet> bets)
        {
            var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            this.context.UploadBets(bets, userId);
        }

        [HttpGet("user/payed")]
        public bool DidPayed()
        {
            var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            if (!string.IsNullOrEmpty(userId))
            {
                var user = this.context.GetUser(userId);
                return user.Payed;
            }

            return false;
        }
    }
}
