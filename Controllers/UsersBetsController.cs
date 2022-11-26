namespace TipTournament2._0.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Data;
    using TipTournament2._0.Models;

    [ApiController]
    [Authorize]
    [Route("api/bets/users")]
    public class UsersBetsController : Controller
    {
        private readonly IDbContextWrapper context;

        [HttpPost]
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

        [HttpPost("group")]
        public IActionResult GetGroupBets([FromBody] string[] usersIds)
        {
            var result = new Dictionary<string, Dictionary<string, GroupBet>>();
            foreach(var userId in usersIds)
            {
                var groupBets = this.context.GetGroupBetsForUser(userId);
                var dict = new Dictionary<string, GroupBet>();
                foreach(var groupBet in groupBets)
                {
                    dict.Add(groupBet.GroupId, groupBet);
                }

                result.Add(userId, dict);
            }

            return new OkObjectResult(result);
        }

        [HttpPost("delta")]
        public IActionResult GetDeltaBets([FromBody] string[] usersIds, [FromQuery] TournamentStage stage)
        {
            var result = new Dictionary<string, Dictionary<string, DeltaBet>>();
            foreach (var userId in usersIds)
            {
                var deltaBets = this.context.GetDeltaBetsForUserAndStage(stage, userId);
                var dict = new Dictionary<string, DeltaBet>();
                foreach (var deltaBet in deltaBets)
                {
                    dict.Add(deltaBet.Id, deltaBet);
                }

                result.Add(userId, dict);
            }

            return new OkObjectResult(result);
        }

        [HttpPost("lambda")]
        public IActionResult GetLambdaBets([FromBody] string[] usersIds)
        {
            var result = new Dictionary<string, TopShooterBet>();
            foreach (var userId in usersIds)
            {
                var shooterBet = this.context.GetShooterBet(userId);
                result.Add(userId, shooterBet);
            }

            return new OkObjectResult(result);
        }

        [HttpPost("omikron")]
        public IActionResult GetOmikronBets([FromBody] string[] usersIds, [FromQuery] bool isWinner)
        {
            var result = new Dictionary<string, SpecificTeamPlaceBet>();
            foreach (var userId in usersIds)
            {
                var omikronBet = this.context.GetTeamPlaceBet(userId, isWinner);
                result.Add(userId, omikronBet);
            }

            return new OkObjectResult(result);
        }
    }
}
