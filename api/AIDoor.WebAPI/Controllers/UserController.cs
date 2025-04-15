using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace AIDoor.WebAPI.Controllers;

public class UserController : BaseController
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("send-code")]
    public async Task<IActionResult> SendVerificationCode([FromBody] SendCodeRequest request)
    {
        if (string.IsNullOrEmpty(request.PhoneNumber))
        {
            return BadRequest("手机号不能为空");
        }

        await _userService.SendVerificationCodeAsync(request.PhoneNumber);
        return Ok("验证码已发送");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.PhoneNumber) || string.IsNullOrEmpty(request.Password) ||
            string.IsNullOrEmpty(request.VerificationCode))
        {
            return BadRequest("请填写完整信息");
        }

        var result = await _userService.RegisterAsync(request.PhoneNumber, request.Password, request.VerificationCode);
        
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.PhoneNumber) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest("请填写完整信息");
        }

        var result = await _userService.LoginAsync(request.PhoneNumber, request.Password);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        // 设置认证Cookie
        var claims = new List<System.Security.Claims.Claim>
        {
            new(ClaimTypes.NameIdentifier, result.User!.Id.ToString()),
            new(ClaimTypes.Name, result.User.Username),
            new(ClaimTypes.MobilePhone, result.User.PhoneNumber)
        };

        var claimsIdentity = new ClaimsIdentity(claims);

        await HttpContext.SignInAsync(
            new ClaimsPrincipal(claimsIdentity),
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            });

        return Ok(result.Message, new
        {
            userId = result.User.Id,
            phoneNumber = result.User.PhoneNumber,
            username = result.User.Username
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok("已成功注销");
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userService.GetUserProfileAsync(UserId);
        
        if (user == null)
        {
            return NotFound("用户不存在");
        }
        
        return Ok(user);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        await _userService.UpdateUserProfileAsync(UserId, request.Username, request.AvatarUrl);
        
        return Ok("更新成功");
    }
}

public record SendCodeRequest(string PhoneNumber);

public record UpdateProfileRequest(string Username, string AvatarUrl);

public record RegisterRequest(string PhoneNumber, string Password, string VerificationCode);

public record LoginRequest(string PhoneNumber, string Password);