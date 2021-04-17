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

    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("admin")]

    public class AdminController : Controller
    {
        private readonly IDbContextWrapper context;
        private readonly IMatchClient matchClient;
        private readonly IResultCoordinator resultCoordinator;

        public AdminController(IDbContextWrapper context, IMatchClient matchClient, IResultCoordinator resultCoordinator)
        {
            this.matchClient = matchClient;
            this.context = context;
            this.resultCoordinator = resultCoordinator;
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
        public void UserPayed([FromRoute]string userId)
        {
            this.context.SetUserAsPayed(userId);
        }

        [HttpGet("matches/load")]
        public async Task<int> ImportMatches()
        {
            var matches = await this.matchClient.LoadMatches();
            this.context.SaveMatches(matches);

            return matches.Count;
        }

        [HttpGet("matches/check")]
        public Task<int> CheckForUpdates()
        {
            return this.resultCoordinator.Coordinate();
        }
        
    }
}
