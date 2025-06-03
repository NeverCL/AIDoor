using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
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
    public class AccountController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private ILogger<AccountController> _logger;

        public AccountController(AppDbContext context, IConfiguration configuration, ILogger<AccountController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginInput loginInput)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Debug: Log the incoming request
            _logger.LogInformation("后台登录 {username}", loginInput.username);

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

        // CRUD operations for Account management

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<AccountListResponse>> GetAccounts([FromQuery] AccountQueryParams queryParams)
        {
            var query = _context.Accounts.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(queryParams.Username))
            {
                query = query.Where(a => a.Username.Contains(queryParams.Username));
            }

            if (queryParams.IsActive.HasValue)
            {
                query = query.Where(a => a.IsActive == queryParams.IsActive.Value);
            }

            // Get total count
            var total = await query.CountAsync();

            // Apply pagination
            var pageSize = queryParams.PageSize ?? 20;
            var current = queryParams.Current ?? 1;
            var skip = (current - 1) * pageSize;

            var accounts = await query
                .OrderByDescending(a => a.Id)
                .Skip(skip)
                .Take(pageSize)
                .Select(a => new AccountInfoResponse
                {
                    Id = a.Id,
                    Username = a.Username,
                    IsAdmin = a.IsAdmin,
                    IsActive = a.IsActive,
                    CreatedAt = a.CreatedAt,
                    LastLoginAt = a.LastLoginAt
                })
                .ToListAsync();

            return Ok(new AccountListResponse
            {
                Data = accounts,
                Total = total,
                Success = true
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<AccountInfoResponse>> GetAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            return Ok(new AccountInfoResponse
            {
                Id = account.Id,
                Username = account.Username,
                IsAdmin = account.IsAdmin,
                IsActive = account.IsActive,
                CreatedAt = account.CreatedAt,
                LastLoginAt = account.LastLoginAt
            });
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<AccountInfoResponse>> CreateAccount([FromBody] AccountCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if username already exists
            if (await _context.Accounts.AnyAsync(a => a.Username == request.Username))
            {
                return BadRequest(new { message = "用户名已存在" });
            }

            var account = new Account
            {
                Username = request.Username,
                PasswordHash = ComputeSha256Hash(request.Password),
                IsAdmin = request.IsAdmin ?? false,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, new AccountInfoResponse
            {
                Id = account.Id,
                Username = account.Username,
                IsAdmin = account.IsAdmin,
                IsActive = account.IsActive,
                CreatedAt = account.CreatedAt,
                LastLoginAt = account.LastLoginAt
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<AccountInfoResponse>> UpdateAccount(int id, [FromBody] AccountUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            // Check if username is being changed and if it already exists
            if (!string.IsNullOrEmpty(request.Username) && request.Username != account.Username)
            {
                if (await _context.Accounts.AnyAsync(a => a.Username == request.Username))
                {
                    return BadRequest(new { message = "用户名已存在" });
                }
                account.Username = request.Username;
            }

            // Update password if provided
            if (!string.IsNullOrEmpty(request.Password))
            {
                account.PasswordHash = ComputeSha256Hash(request.Password);
            }

            if (request.IsAdmin.HasValue)
            {
                account.IsAdmin = request.IsAdmin.Value;
            }

            if (request.IsActive.HasValue)
            {
                account.IsActive = request.IsActive.Value;
            }

            await _context.SaveChangesAsync();

            return Ok(new AccountInfoResponse
            {
                Id = account.Id,
                Username = account.Username,
                IsAdmin = account.IsAdmin,
                IsActive = account.IsActive,
                CreatedAt = account.CreatedAt,
                LastLoginAt = account.LastLoginAt
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}