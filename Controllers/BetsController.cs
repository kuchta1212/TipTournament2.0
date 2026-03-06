
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
    using TipTournament2._0.Utils;

    [ApiController]
    [Authorize]
    [Route("api/bets")]

    public class BetsController : Controller
    {
        private readonly IDbContextWrapper context;
        private readonly ITeamGenerator teamGenerator;
        private readonly IBetGenerator betGenerator;

        public BetsController(IDbContextWrapper context, ITeamGenerator teamGenerator, IBetGenerator betGenerator)
        {
            this.context = context;
            this.teamGenerator = teamGenerator;
            this.betGenerator = betGenerator;
        }
        [HttpGet("")]
        public IActionResult GetBets()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpGet("{userId}")]
        public IActionResult GetBets([FromRoute] string userId)
        {
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.context.GetBetsStatus(userId));
        }

        [HttpGet("status/{stage}")]
        public IActionResult GetStageStatus([FromRoute] TournamentStage stage)
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.GetBetsStatus(stage, userId));
        }

        [HttpGet("deadlines")]
        public IActionResult GetDeadlines()
        {
            var stageDeadlines = new Dictionary<TournamentStage, DateTime>();
            var tournamentStart = this.context.GetTournamentStartTime();

            stageDeadlines[TournamentStage.Group] = tournamentStart;
            stageDeadlines[TournamentStage.Winner] = tournamentStart;
            stageDeadlines[TournamentStage.Lambda] = tournamentStart;
            stageDeadlines[TournamentStage.Omikron] = tournamentStart;

            // All knockout stages share the same deadline: first match of FirstRound
            DateTime knockoutDeadline;
            try
            {
                knockoutDeadline = this.context.GetStageStartTime(TournamentStage.FirstRound);
            }
            catch
            {
                knockoutDeadline = DateTime.MaxValue;
            }

            stageDeadlines[TournamentStage.FirstRound] = knockoutDeadline;
            stageDeadlines[TournamentStage.Quarterfinal] = knockoutDeadline;
            stageDeadlines[TournamentStage.Semifinal] = knockoutDeadline;
            stageDeadlines[TournamentStage.Final] = knockoutDeadline;

            var deadlineInfo = new DeadlineInfo
            {
                TournamentStart = tournamentStart,
                StageDeadlines = stageDeadlines
            };

            return new OkObjectResult(deadlineInfo);
        }

        [HttpPost("status/{stage}/confirm")]
        public IActionResult ConfirmBetsStatus([FromRoute] TournamentStage stage)
        {
            if (!this.IsStageOpen(stage))
            {
                return BadRequest("Sázky pro tuto fázi jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.ConfirmBetsStatus(stage, userId));
        }

        [HttpPost("status/{stage}/modify")]
        public IActionResult ModifyBetsStatus([FromRoute] TournamentStage stage)
        {
            if (!this.IsStageOpen(stage))
            {
                return BadRequest("Sázky pro tuto fázi jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.ModifyBetsStatus(stage, userId));
        }

        [HttpGet("groups")]
        public IActionResult GetGroups()
        {
            return new OkObjectResult(this.context.GetGroups());
        }

        [HttpGet("group")]
        public IActionResult GetGroupBet([FromQuery] string groupId, [FromQuery] string userId = null)
        {
            return new OkObjectResult(this.context.GetGroupBetByGroupId(groupId, userId ?? this.GetUserId()));
        }

        [HttpGet("teamplace")]
        public IActionResult GetTeamPlaceBet([FromQuery] bool isWinnerBet, [FromQuery] string userId = null)
        {
            return new OkObjectResult(this.context.GetTeamPlaceBet(userId ?? this.GetUserId(), isWinnerBet));
        }

        [HttpGet("teamplace/teams")]
        public IActionResult GetTeamPlaceBetTeams([FromQuery] bool isWinnerBet)
        {
            var teams = isWinnerBet
                ? this.context.GetAllTeams().ToArray()
                : this.teamGenerator.GenerateSpecificBetTeams();

            return new OkObjectResult(teams);
        }

        [HttpGet("shooter")]
        public IActionResult GetShooterBet([FromQuery] string userId = null)
        {
            return new OkObjectResult(this.context.GetShooterBet(userId ?? this.GetUserId()));
        }

        [HttpGet("delta")]
        public IActionResult GetDelaBet([FromQuery] string matchId, [FromQuery] string userId = null)
        {
            return new OkObjectResult(this.context.GetDeltaBetByMatchId(userId ?? this.GetUserId(), matchId));
        }

        [HttpGet("group/teams")]
        public IActionResult GetGroupTeams([FromQuery] string groupId)
        {
            return new OkObjectResult(this.context.GetGroupTeams(groupId));
        }

        [HttpGet("delta/teams")]
        public IActionResult GetDeltaTeams([FromQuery] string matchId, [FromQuery] TournamentStage stage, [FromQuery] string userId = null)
        {
            return new OkObjectResult(this.teamGenerator.GenerateTeams(matchId, stage == TournamentStage.FirstRound, userId ?? this.GetUserId()));
        }

        [HttpPost("generate/groupbet")]
        public IActionResult GenerateGroupBets()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.CheckGroupMatchesAndGenerateTableResults(userId));
        }

        [HttpPost("tip")]
        public IActionResult UploadTip([FromBody] UploadTipRequest request)
        {
            var match = this.context.GetMatchById(request.MatchId);
            if (match == null)
            {
                return BadRequest("Zápas nebyl nalezen.");
            }

            if (DateTime.UtcNow >= match.StartTime)
            {
                return BadRequest("Sázky na tento zápas jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            this.context.UploadTip(request.Tip, request.MatchId, userId);
            return new OkResult();
        }

        [HttpPost("group")]
        public IActionResult UploadGroupBet([FromBody] GroupBet groupBet, [FromQuery] string groupId)
        {
            if (!this.IsTournamentOpen())
            {
                return BadRequest("Sázky na skupiny jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            this.context.UploadGroupBet(groupBet, groupId, userId);
            return new OkResult();
        }

        [HttpPost("delta")]
        public IActionResult UploadDeltaBet([FromBody] DeltaBet deltaBet, [FromQuery] string matchId)
        {
            var match = this.context.GetMatchById(matchId);
            if (match == null)
            {
                return BadRequest("Zápas nebyl nalezen.");
            }

            if (!this.IsStageOpen(match.Stage))
            {
                return BadRequest("Sázky pro tuto fázi jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            this.context.UpsertDeltaBet(deltaBet, matchId, userId);
            return new OkResult();
        }


        [HttpPost("teamplace")]
        public IActionResult UploadTeamPlaceBet([FromQuery] string teamId, [FromQuery] bool isWinnerBet, [FromQuery] TournamentStage stage)
        {
            if (!this.IsTournamentOpen())
            {
                return BadRequest("Sázky na umístění týmů jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            this.context.UpsertTeamPlaceBet(teamId, userId, isWinnerBet, stage);
            return new OkObjectResult(this.context.GetTeamPlaceBet(userId, isWinnerBet));
        }


        [HttpPost("shooter")]
        public IActionResult UploadShooterBet([FromQuery] string name)
        {
            if (!this.IsTournamentOpen())
            {
                return BadRequest("Sázky na nejlepšího střelce jsou již uzavřeny.");
            }

            var userId = this.GetUserId();
            this.context.UpsertShooterBet(name, userId);
            return new OkObjectResult(this.context.GetShooterBet(userId));
        }

        [HttpPost("users")]
        public IActionResult GetBets([FromBody] string[] userIds)
        {
            var result = new Dictionary<string, MatchBet[]>();
            foreach (var userId in userIds)
            {
                var bets = this.context.GetBetsForUser(userId);
                result.Add(userId, bets.ToArray());
            }
            return new OkObjectResult(result);
        }


        private string GetUserId()
        {
            return this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
        }

        private bool IsTournamentOpen()
        {
            try
            {
                var tournamentStart = this.context.GetTournamentStartTime();
                return DateTime.UtcNow < tournamentStart;
            }
            catch
            {
                return true;
            }
        }

        private bool IsStageOpen(TournamentStage stage)
        {
            try
            {
                switch (stage)
                {
                    case TournamentStage.Group:
                    case TournamentStage.Winner:
                    case TournamentStage.Lambda:
                    case TournamentStage.Omikron:
                        return this.IsTournamentOpen();
                    case TournamentStage.FirstRound:
                    case TournamentStage.Quarterfinal:
                    case TournamentStage.Semifinal:
                    case TournamentStage.Final:
                        var knockoutStart = this.context.GetStageStartTime(TournamentStage.FirstRound);
                        return DateTime.UtcNow < knockoutStart;
                    default:
                        return true;
                }
            }
            catch
            {
                return true;
            }
        }
    }
}
