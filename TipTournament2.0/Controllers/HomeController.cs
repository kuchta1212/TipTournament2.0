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

    [AllowAnonymous]
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
        public async Task<HomeScreenModel> Index()
        {
            var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            var screen = new HomeScreenModel()
            {
                Bets = await this.context.GetBetsForUser(userId),
                Matches = await this.context.GetMatches(),
                Users = await this.context.GetUsers()
            };

            return screen;
        }

        [HttpGet("matches")]
        public Task<List<Match>> GetMatches() 
        {
            return this.context.GetMatches();
        }

        [HttpGet("bets/all")]
        public async Task<Dictionary<ApplicationUser, IEnumerable<Bet>>> GetAllBets()
        {
            var bets = await this.context.GetAllBets();
            var users = await this.context.GetUsers();

            return users.Select(x => new { key = x, value = bets.Where(b => b.User == x) }).ToDictionary(e => e.key, e => e.value);
        }
                
        [HttpPost("bets")]
        public async Task UploadBets([FromBody]List<Bet> bets)
        {
            var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            await this.context.UploadBetsForUser(bets, userId);
        }

        [HttpGet("user/payed")]
        public async Task<bool> DidPayed()
        {
            var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await this.context.GetUser(userId);
                return user.Payed;
            }

            return false;
        }
    }
}
