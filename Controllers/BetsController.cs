﻿
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

        [HttpPost("status/{stage}/confirm")]
        public IActionResult ConfirmBetsStatus([FromRoute] TournamentStage stage)
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.betGenerator.ConfirmBetsStatus(stage, userId));
        }

        [HttpPost("status/{stage}/modify")]
        public IActionResult ModifyBetsStatus([FromRoute] TournamentStage stage)
        {
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
                ? this.teamGenerator.GetFinalists(this.GetUserId())
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
            var userId = this.GetUserId();
            this.context.UploadTip(request.Tip, request.MatchId, userId);
            return new OkResult();
        }

        [HttpPost("group")]
        public IActionResult UploadGroupBet([FromBody] GroupBet groupBet, [FromQuery] string groupId)
        {
            var userId = this.GetUserId();
            this.context.UploadGroupBet(groupBet, groupId, userId);
            return new OkResult();
        }

        [HttpPost("delta")]
        public IActionResult UploadDeltaBet([FromBody] DeltaBet deltaBet, [FromQuery] string matchId)
        {
            var userId = this.GetUserId();
            this.context.UpsertDeltaBet(deltaBet, matchId, userId);
            return new OkResult();
        }


        [HttpPost("teamplace")]
        public IActionResult UploadTeamPlaceBet([FromQuery] string teamId, [FromQuery] bool isWinnerBet, [FromQuery] TournamentStage stage)
        {
            var userId = this.GetUserId();
            this.context.UpsertTeamPlaceBet(teamId, userId, isWinnerBet, stage);
            return new OkObjectResult(this.context.GetTeamPlaceBet(userId, isWinnerBet));
        }


        [HttpPost("shooter")]
        public IActionResult UploadShooterBet([FromQuery] string name)
        {
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




    }
}
