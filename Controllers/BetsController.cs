
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

        public BetsController(IDbContextWrapper context, ITeamGenerator teamGenerator)
        {
            this.context = context;
            this.teamGenerator = teamGenerator;
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

        [HttpGet("deadlines")]
        public IActionResult GetDeadlines()
        {
            var stageDeadlines = new Dictionary<string, DateTime>();
            var tournamentStart = this.context.GetTournamentStartTime();

            stageDeadlines[nameof(TournamentStage.Group)] = tournamentStart;
            stageDeadlines[nameof(TournamentStage.Winner)] = tournamentStart;
            stageDeadlines[nameof(TournamentStage.Lambda)] = tournamentStart;
            stageDeadlines[nameof(TournamentStage.Omikron)] = tournamentStart;

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

            stageDeadlines[nameof(TournamentStage.FirstRound)] = knockoutDeadline;
            stageDeadlines[nameof(TournamentStage.Quarterfinal)] = knockoutDeadline;
            stageDeadlines[nameof(TournamentStage.Semifinal)] = knockoutDeadline;
            stageDeadlines[nameof(TournamentStage.Final)] = knockoutDeadline;

            var deadlineInfo = new DeadlineInfo
            {
                TournamentStart = tournamentStart,
                StageDeadlines = stageDeadlines
            };

            return new OkObjectResult(deadlineInfo);
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
            var effectiveUserId = userId ?? this.GetUserId();

            // Auto-fill FirstRound delta bets when fetching teams for the first time
            if (stage == TournamentStage.FirstRound)
            {
                this.GenerateFirstRound(effectiveUserId);
            }

            return new OkObjectResult(this.teamGenerator.GenerateTeams(matchId, stage == TournamentStage.FirstRound, effectiveUserId));
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

        [HttpPost("joker")]
        public IActionResult SetJoker([FromQuery] string matchId)
        {
            var match = this.context.GetMatchById(matchId);
            if (match == null)
            {
                return BadRequest("Zápas nebyl nalezen.");
            }

            if (match.Stage != TournamentStage.Group)
            {
                return BadRequest("Joker lze nastavit pouze na skupinové zápasy.");
            }

            if (DateTime.UtcNow >= match.StartTime)
            {
                return BadRequest("Zápas již začal, Joker nelze změnit.");
            }

            var userId = this.GetUserId();

            // Get all bets for this round — the target bet must be among them
            var roundBets = this.context.GetBetsForUserAndRound(userId, match.Round);
            var targetBet = roundBets.FirstOrDefault(b => b.Match != null && b.Match.Id == matchId);
            if (targetBet == null)
            {
                return BadRequest("Nejprve musíš zadat tip na tento zápas.");
            }

            // If existing joker in this round is on a match that already started, round is locked
            var existingJoker = roundBets.FirstOrDefault(b => b.IsJoker);
            if (existingJoker != null && existingJoker.Match != null && DateTime.UtcNow >= existingJoker.Match.StartTime)
            {
                return BadRequest("Joker v tomto kole je již uzamčen — zápas s Jokerem již začal.");
            }

            // Clear existing Joker in the same round, then set on target
            foreach (var roundBet in roundBets)
            {
                roundBet.IsJoker = false;
            }

            targetBet.IsJoker = true;
            this.context.UpdateBets(roundBets);

            return new OkResult();
        }

        [HttpGet("match/{matchId}")]
        public IActionResult GetBetsForMatch([FromRoute] string matchId)
        {
            var match = this.context.GetMatchById(matchId);
            if (match == null)
            {
                return NotFound("Zápas nebyl nalezen.");
            }

            if (DateTime.UtcNow < match.StartTime)
            {
                return BadRequest("Sázky na tento zápas ještě nelze zobrazit.");
            }

            var bets = this.context.GetBetsForMatch(match);
            return new OkObjectResult(bets);
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

        private void GenerateFirstRound(string userId)
        {
            var matches = this.context.GetMatches(TournamentStage.FirstRound);
            foreach (var match in matches)
            {
                var existingBet = this.context.GetDeltaBetByMatchId(userId, match.Id);
                if (existingBet != null)
                {
                    continue;
                }

                var teams = this.teamGenerator.GenerateTeams(match.Id, true, userId);
                var deltaBet = new DeltaBet()
                {
                    HomeTeamBet = teams.PossibleHomeTeams.Count == 1 ? teams.PossibleHomeTeams.First() : null,
                    AwayTeamBet = teams.PossibleAwayTeams.Count == 1 ? teams.PossibleAwayTeams.First() : null,
                };
                this.context.UpsertDeltaBet(deltaBet, match.Id, userId);
            }
        }
    }
}
