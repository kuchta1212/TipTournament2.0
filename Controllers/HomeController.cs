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
    [Route("api")]
    public class HomeController : Controller
    {
        private readonly IDbContextWrapper context;

        public HomeController(IDbContextWrapper context)
        {
            this.context = context;
        }

        [HttpGet("users")]
        public IActionResult GetUsers([FromQuery] bool orderByPoints)
        {
            return orderByPoints
                ? new OkObjectResult(this.context.GetAllUsers().Select(u => UiUser.FromApplicationUser(u)).OrderByDescending(u => u.TotalPoints).ToList())
                : new OkObjectResult(this.context.GetAllUsers().Select(u => UiUser.FromApplicationUser(u)).ToList());
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

        [HttpGet("status")]
        public IActionResult GetUpdateStatus()
        {
            return new OkObjectResult(this.context.GetLatestUpdateStatus());
        }

        private string GetUserId()
        {
            return this.User.Identity.IsAuthenticated ? this.User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;
        }
    }
}
