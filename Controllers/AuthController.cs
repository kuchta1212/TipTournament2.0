namespace TipTournament2._0.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using System.Linq;
    using System.Threading.Tasks;
    using TipTournament2._0.Models;
    using TipTournament2._0.Utils;

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Neplatné přihlašovací údaje." });
            }

            // Accept either username or email as login identifier
            var user = request.UserName.Contains('@')
                ? await _userManager.FindByEmailAsync(request.UserName)
                : await _userManager.FindByNameAsync(request.UserName);

            if (user == null)
            {
                return BadRequest(new { message = "Neplatné přihlašovací údaje." });
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, isPersistent: true, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return Ok(new { userName = user.UserName, didPayed = user.Payed });
            }

            return BadRequest(new { message = "Neplatné přihlašovací údaje." });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpGet("user")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUser()
        {
            if (User.Identity?.IsAuthenticated != true)
            {
                return Ok(new { isAuthenticated = false });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Ok(new { isAuthenticated = false });
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                isAuthenticated = true,
                userId = user.Id,
                userName = user.UserName,
                didPayed = user.Payed,
                roles = roles.ToList()
            });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                RecoveryCode = RecoveryCodeGenerator.Generate()
            };
            var result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: true);
                return Ok(new
                {
                    userName = user.UserName,
                    didPayed = user.Payed,
                    recoveryCode = user.RecoveryCode
                });
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPost("recovery/reset")]
        [AllowAnonymous]
        public async Task<IActionResult> RecoveryReset([FromBody] RecoveryResetRequest request)
        {
            if (string.IsNullOrEmpty(request.Email)
                || string.IsNullOrEmpty(request.RecoveryCode)
                || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new { message = "Neplatné údaje." });
            }

            // Accept either email or username. Try email first (most users
            // will type that), fall back to username — handles legacy accounts
            // where NormalizedEmail may not be set.
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                user = await _userManager.FindByNameAsync(request.Email);
            }
            if (user == null)
            {
                // Last-resort case-insensitive scan against raw Email/UserName,
                // for accounts where the Identity normalized fields are stale.
                user = _userManager.Users.FirstOrDefault(u =>
                    (u.Email != null && u.Email.ToLower() == request.Email.ToLower())
                    || (u.UserName != null && u.UserName.ToLower() == request.Email.ToLower()));
            }

            if (user == null
                || string.IsNullOrEmpty(user.RecoveryCode)
                || !string.Equals(user.RecoveryCode, request.RecoveryCode, System.StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Neplatné údaje." });
            }

            var removeResult = await _userManager.RemovePasswordAsync(user);
            if (!removeResult.Succeeded)
            {
                return BadRequest(new { errors = removeResult.Errors });
            }
            var addResult = await _userManager.AddPasswordAsync(user, request.NewPassword);
            if (!addResult.Succeeded)
            {
                return BadRequest(new { errors = addResult.Errors });
            }

            await _signInManager.SignInAsync(user, isPersistent: true);
            return Ok(new { userName = user.UserName, didPayed = user.Payed });
        }
    }

    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RecoveryResetRequest
    {
        public string Email { get; set; }
        public string RecoveryCode { get; set; }
        public string NewPassword { get; set; }
    }
}
