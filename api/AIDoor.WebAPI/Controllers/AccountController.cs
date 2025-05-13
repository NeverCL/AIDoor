using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace AIDoor.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AccountController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginInput loginInput)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Debug: Log the incoming request
            Console.WriteLine($"Login request: {JsonSerializer.Serialize(loginInput)}");
            Console.WriteLine($"Username: {loginInput.username}");
            Console.WriteLine($"Password: {loginInput.password?.Length > 0}");
            Console.WriteLine($"Type: {loginInput.type}");
            Console.WriteLine($"AutoLogin: {loginInput.autoLogin}");

            // Compute hash of the provided password
            string passwordHash = ComputeSha256Hash(loginInput.password);

            // Find the account by username and password
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Username == loginInput.username && a.PasswordHash == passwordHash);

            if (account == null)
            {
                return Ok(new LoginResponse
                {
                    Status = "error",
                    Type = loginInput.type ?? "account"
                });
            }

            if (!account.IsActive)
            {
                return Ok(new LoginResponse
                {
                    Status = "error",
                    Type = loginInput.type ?? "account"
                });
            }

            // Update last login timestamp
            account.LastLoginAt = DateTime.Now;
            await _context.SaveChangesAsync();

            // Create authentication cookie
            await SignInAsync(account);

            return Ok(new LoginResponse
            {
                Status = "ok",
                Type = loginInput.type ?? "account",
                CurrentAuthority = account.IsAdmin ? "admin" : "user"
            });
        }

        private async Task SignInAsync(Account account)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Name, account.Username),
                new Claim(ClaimTypes.Role, account.IsAdmin ? "admin" : "user")
            };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
        }

        private string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { status = "ok" });
        }

        [HttpGet("currentUser")]
        public ActionResult GetCurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Ok(new
                {
                    data = new CurrentUserResponse
                    {
                        IsAuthenticated = false
                    }
                });
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int accountId))
            {
                return Unauthorized();
            }

            return Ok(new
            {
                data = new CurrentUserResponse
                {
                    IsAuthenticated = true,
                    Name = username,
                    Userid = accountId.ToString(),
                    Access = role,
                    Avatar = "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                }
            });
        }
    }
}