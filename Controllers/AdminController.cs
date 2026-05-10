namespace TipTournament2._0.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Coordinator;
    using TipTournament2._0.Data;
    using TipTournament2._0.MatchClient;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin")]

    public class AdminController : Controller
    {
        private readonly IDbContextWrapper context;
        private readonly IMatchClient matchClient;
        private readonly IResultCoordinatorFactory resultCoordinatorFactory;
        private readonly ITeamGenerator teamGenerator;
        private readonly GeneralOption generalConfig;
        private readonly UserManager<ApplicationUser> userManager;

        public AdminController(IDbContextWrapper context, IMatchClient matchClient, IResultCoordinatorFactory resultCoordinatorFactory, ITeamGenerator teamGenerator, Microsoft.Extensions.Options.IOptions<GeneralOption> generalOptions, UserManager<ApplicationUser> userManager)
        {
            this.matchClient = matchClient;
            this.context = context;
            this.resultCoordinatorFactory = resultCoordinatorFactory;
            this.teamGenerator = teamGenerator;
            this.generalConfig = generalOptions.Value;
            this.userManager = userManager;
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
        
        [HttpPost("result")]
        public IActionResult UploadResult([FromQuery] string matchId, [FromBody] Result result)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Group).UploadNewResult(matchId, result);
            return new OkResult();
        }

        [HttpPost("group/result")]
        public IActionResult UploadGroupResult([FromQuery] string groupId, [FromBody] GroupResult result)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Group, true).UploadNewResult(groupId, result);
            return new OkResult();
        }

        [HttpGet("delta/teams")]
        public IActionResult GetPossibleTeams([FromQuery] string matchId, [FromQuery] TournamentStage stage)
        {
            try
            {
                return new OkObjectResult(this.teamGenerator.GenerateTeams(matchId, stage));
            }
            catch
            {
                return new OkObjectResult(new DeltaBetTeams
                {
                    PossibleHomeTeams = new System.Collections.Generic.List<Team>(),
                    PossibleAwayTeams = new System.Collections.Generic.List<Team>()
                });
            }
        }
        
        [HttpPost("match")]
        public IActionResult SetTeamsForMatch([FromQuery] string matchId, [FromQuery] string homeTeamId, [FromQuery] string awayTeamId)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.FirstRound).UploadNewResult(matchId, new Tuple<string, string>(homeTeamId, awayTeamId));
            return new OkResult();
        }

        [HttpPost("omikron")]
        public IActionResult EvaluateOmikron()
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Omikron).UploadNewResult<object>(string.Empty, new object());
            return new OkResult();
        }

        [HttpPost("winner")]
        public IActionResult SetWinner([FromQuery] string teamId)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Winner).UploadNewResult<string>(generalConfig.FinalMatchId, teamId);
            return new OkResult();
        }

        [HttpPost("shooter")]
        public IActionResult EvaluateShooter([FromQuery] string name)
        {
            this.resultCoordinatorFactory.Create(TournamentStage.Lambda).UploadNewResult<string>(string.Empty, name);
            return new OkResult();
        }

        [HttpPost("{userId}/admin")]
        public async Task<IActionResult> SetAdmin([FromRoute] string userId, [FromQuery] bool isAdmin)
        {
            var user = await this.userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (isAdmin)
            {
                await this.userManager.AddToRoleAsync(user, "Admin");
            }
            else
            {
                await this.userManager.RemoveFromRoleAsync(user, "Admin");
            }

            return new OkResult();
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var users = this.context.GetUsers();
            var medalsByUser = this.context.GetMedalsForUsers(users.Select(u => u.Id));
            var result = new List<object>();
            foreach (var user in users)
            {
                var roles = await this.userManager.GetRolesAsync(user);
                medalsByUser.TryGetValue(user.Id, out var medals);
                result.Add(new
                {
                    id = user.Id,
                    userName = user.UserName,
                    payed = user.Payed,
                    isAdmin = roles.Contains("Admin"),
                    medals = (medals ?? new List<UserMedal>())
                        .Select(m => new { tournament = m.Tournament, place = m.Place })
                        .ToList()
                });
            }

            return new OkObjectResult(result);
        }

        [HttpPost("{userId}/medal")]
        public async Task<IActionResult> ToggleMedal([FromRoute] string userId, [FromBody] ToggleMedalRequest request)
        {
            var user = await this.userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var assigned = this.context.ToggleUserMedal(userId, request.Tournament, request.Place);
            return new OkObjectResult(new { assigned });
        }
    }

    public class ToggleMedalRequest
    {
        public Tournament Tournament { get; set; }
        public MedalPlace Place { get; set; }
    }
}
