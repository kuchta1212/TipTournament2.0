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
            return new OkObjectResult(this.context.GetMatches().OrderBy(m => m.StartTime).ToList());
        }

        [HttpGet("")]
        public IActionResult GetMatches([FromQuery] TournamentStage stage)
        {
            return new OkObjectResult(this.context.GetMatches(stage).OrderBy(m => m.StartTime).ToList());
        }
    }
}
