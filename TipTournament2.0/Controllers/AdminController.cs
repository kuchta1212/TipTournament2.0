using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TipTournament2._0.Data;
using TipTournament2._0.MatchClient;
using TipTournament2._0.Models;

namespace TipTournament2._0.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("admin")]

    public class AdminController : Controller
    {
        private readonly IDbContextWrapper context;
        private readonly IMatchClient matchClient;

        public AdminController(IDbContextWrapper context, IMatchClient matchClient)
        {
            this.matchClient = matchClient;
            this.context = context;
        }

        [HttpGet]
        public async Task<AdminScreenModel> Index()
        {
            return new AdminScreenModel()
            {
                Users = await this.context.GetUsers()
            };            
        }

        [HttpPost("{userId}/payed")]
        public async Task UserPayed([FromRoute]string userId)
        {
            await this.context.SetUserAsPayed(userId);
        }

        [HttpGet("matches/load")]
        public async Task<int> ImportMatches()
        {
            var matches = await this.matchClient.LoadMatches();
            await this.context.SaveMatches(matches);

            return matches.Count;
        }

        [HttpGet("matches/check")]
        public async Task<int> CheckForUpdates()
        {
            var results = await this.matchClient.CheckForUdpates();
            await this.context.SaveResults(results);
            return results.Count;
        }
        
    }
}
