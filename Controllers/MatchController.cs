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
    [Route("api/match")]
    public class MatchController : Controller
    {
        private readonly IDbContextWrapper context;

        public MatchController(IDbContextWrapper context)
        {
            this.context = context;
        }

        [HttpGet("all")]
        public IActionResult GetAllMatches()
        {
            var matches = this.context.GetMatches().OrderBy(m => m.StartTime).ToList();
            matches.ForEach(m => m.StartTime = DateTime.SpecifyKind(m.StartTime, DateTimeKind.Utc));
            return new OkObjectResult(matches);
        }

        [HttpGet("")]
        public IActionResult GetMatches([FromQuery] TournamentStage stage)
        {
            var matches = this.context.GetMatches(stage).OrderBy(m => m.StartTime).ToList();
            matches.ForEach(m => m.StartTime = DateTime.SpecifyKind(m.StartTime, DateTimeKind.Utc));
            return new OkObjectResult(matches);
        }
    }
}
