﻿namespace TipTournament2._0.Controllers
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
    [Route("api")]
    public class HomeController : Controller
    {
        private readonly IDbContextWrapper context;

        public HomeController(IDbContextWrapper context)
        {
            this.context = context;
        }

        [HttpGet("data")]
        public IActionResult GetData()
        {
            var userId = this.GetUserId();
            var screen = new HomeScreenModel()
            {
                Bets = this.context.GetBetsForUser(userId),
                Matches = this.context.GetMatches().OrderBy(m => m.StartTime).ToList(),
                Users = this.context.GetUsers().OrderByDescending(u => u.Points).ToList()
            };

            return new OkObjectResult(screen);
        }

        [HttpGet("matches")]
        public IActionResult GetMatches() 
        {
            return new OkObjectResult(this.context.GetMatches().OrderBy(m => m.StartTime).ToList());
        }

        [HttpGet("bets")]
        public IActionResult GetBets()
        {
            var userId = this.GetUserId();
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        [HttpGet("bets/{userId}")]
        public IActionResult GetBets([FromRoute] string userId)
        {
            return new OkObjectResult(this.context.GetBetsForUser(userId));
        }

        //[HttpGet("bets/all")]
        //public IActionResult GetAllBets()
        //{
        //    var bets = this.context.GetAllBets();
        //    var users = this.context.GetUsers();

        //    return new OkObjectResult(users.Select(x => new { key = x, value = bets.Where(b => b.User == x) }).ToDictionary(e => e.key, e => e.value));
        //}

        //[HttpPost("tips")]
        //public void UploadTips([FromBody]Dictionary<string, Result> tips)
        //{
        //    var userId = this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
        //    this.context.UploadTips(tips, userId);
        //}

        [HttpPost("tip")]
        public IActionResult UploadTip([FromBody] UploadTipRequest request)
        {
            var userId = this.GetUserId();
            this.context.UploadTip(request.Tip, request.MatchId, userId);
            return new OkResult();
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return new OkObjectResult(this.context.GetAllUsers().Select(u => UiUser.FromApplicationUser(u)).ToList());
        }

        [HttpGet("user/payed")]
        public IActionResult DidPayed()
        {
            var userId = this.GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                var user = this.context.GetUser(userId);
                return new OkObjectResult(user.Payed);
            }

            return new OkObjectResult(false);
        }

        private string GetUserId()
        {
            return this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
        }
    }
}
