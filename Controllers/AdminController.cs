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
    [Authorize]
    [Route("api/admin")]

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

        [HttpGet("matches/check")]
        public async Task<IActionResult> CheckForUpdates()
        {
            return new OkObjectResult(await this.resultCoordinator.Coordinate());
        }
        
        [HttpPost("result")]
        public async Task<IActionResult> UploadResult([FromQuery] string matchId, [FromBody] Result result)
        {
            this.resultCoordinator.UploadNewResult(matchId, result);
            return new OkResult();
        }

    }
}
