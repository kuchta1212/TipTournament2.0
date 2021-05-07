namespace TipTournament.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using TipTournament.Data;
    using TipTournament.Models;

    [ApiController]
    [Route("")]
    public class HomeController : Controller
    {
        private readonly IDbContextWrapper context;

        public HomeController(IDbContextWrapper context)
        {
            this.context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            //var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            var screen = new HomeScreenModel()
            {
            //    Bets = this.context.GetBetsForUser(userId),
                Matches = this.context.GetMatches(),
            //    Users = this.context.GetUsers()
            };

            return new OkObjectResult(screen);
        }

        [HttpGet("matches")]
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
