using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using System.Text.Json.Serialization;
using AIDoor.WebAPI.Dtos;

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
        if (string.IsNullOrEmpty(request.Phone))
        {
            return BadRequest("手机号不能为空");
        }

        await _userService.SendVerificationCodeAsync(request.Phone);
        return Ok("验证码已发送");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Phone) ||
            string.IsNullOrEmpty(request.Code) || string.IsNullOrEmpty(request.Name))
        {
            return BadRequest("请填写完整信息");
        }

        var result = await _userService.RegisterAsync(request.Phone, request.Password ?? "", request.Code, request.Name);

        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    /// <summary>
    /// 获取随机昵称
    /// </summary>
    /// <returns>随机生成的昵称</returns>
    [HttpGet("random-nickname")]
    public IActionResult GetRandomNickname()
    {
        var nickname = _userService.GenerateRandomNickname();
        return Ok(new { nickname });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Phone) || string.IsNullOrEmpty(request.Code))
        {
            return BadRequest("请填写完整信息");
        }

        var result = await _userService.LoginWithCodeAsync(request.Phone, request.Code);
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

    /// <summary>
    /// 获取用户的消息和关注统计数据
    /// </summary>
    /// <returns>消息数量和关注数量</returns>
    [HttpGet("stats")]
    public async Task<IActionResult> GetUserStats()
    {
        // 获取当前用户ID
        var userId = UserId;

        // 调用服务获取统计数据
        var userStats = await _userService.GetUserStatsAsync(userId);

        if (userStats == null)
        {
            return NotFound("无法获取用户统计数据");
        }

        return Ok(userStats);
    }

    /// <summary>
    /// 获取用户记录数据（点赞、收藏、足迹）
    /// </summary>
    /// <returns>用户记录数据</returns>
    [HttpGet("records")]
    public async Task<IActionResult> GetUserRecords()
    {
        var userId = UserId;
        var recordsData = await _userService.GetUserRecordsAsync(userId);

        return Ok(recordsData);
    }
}

public record SendCodeRequest(string Phone);

public record UpdateProfileRequest(string Username, string AvatarUrl);

public record RegisterRequest(string Name, string Phone, string Code, string? Password = null);

public record LoginRequest(string Phone, string Code);