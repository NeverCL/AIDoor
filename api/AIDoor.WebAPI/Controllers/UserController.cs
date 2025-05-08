using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using System.Text.Json.Serialization;
using AIDoor.WebAPI.Dtos;
using AIDoor.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using AIDoor.WebAPI.Domain;
namespace AIDoor.WebAPI.Controllers;

public class UserController : BaseController
{
    private readonly UserService _userService;
    private const string DEV_MODE_COOKIE = "DevMode";

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    // 辅助方法：创建用户身份认证并设置Cookie
    [AllowAnonymous]
    private async Task SignInUserAsync(User user)
    {
        // 设置认证Cookie
        var claims = new List<System.Security.Claims.Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.MobilePhone, user.PhoneNumber),
            // 使用自定义类型保存开发者模式状态
            new(DEV_MODE_COOKIE, user.IsDevMode.ToString())
        };

        var claimsIdentity = new ClaimsIdentity(claims, "login");

        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
        };

        await HttpContext.SignInAsync(
            new ClaimsPrincipal(claimsIdentity),
            authProperties
        );
    }

    [AllowAnonymous]
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

    [AllowAnonymous]
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

        // 注册成功后自动登录
        if (result.User != null)
        {
            await SignInUserAsync(result.User);
        }

        return Ok(result.Message);
    }

    /// <summary>
    /// 获取随机昵称
    /// </summary>
    /// <returns>随机生成的昵称</returns>
    [HttpGet("random-nickname")]
    [AllowAnonymous]
    public IActionResult GetRandomNickname()
    {
        var nickname = _userService.GenerateRandomNickname();
        return Ok(new { nickname });
    }

    [AllowAnonymous]
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

        // 使用共用方法设置认证Cookie
        await SignInUserAsync(result.User!);

        return Ok(result.Message);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok("已成功退出登录");
    }

    /// <summary>
    /// 注销/删除用户账号
    /// </summary>
    /// <returns>注销结果</returns>
    [HttpPost("delete-account")]
    public async Task<IActionResult> DeleteAccount()
    {
        // 获取当前用户ID
        var userId = UserId;
        if (userId <= 0)
        {
            return BadRequest("未登录，无法注销账号");
        }

        // 调用删除账号的服务
        var result = await _userService.DeleteAccountAsync(userId);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        // 注销成功后，退出登录
        await HttpContext.SignOutAsync();
        return Ok(result.Message);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userService.GetUserProfileAsync(UserId);

        if (user == null)
        {
            return NotFound();
        }

        // 首先尝试从Claims中获取开发者模式状态
        var isDevMode = User.FindFirstValue(DEV_MODE_COOKIE)?.ToLower() == "true";

        // 设置用户开发者模式状态
        user.IsDevMode = isDevMode;

        return Ok(user);
    }

    /// <summary>
    /// 切换用户身份（开发者/使用者模式）
    /// </summary>
    /// <returns>切换结果</returns>
    [HttpPost("switch-mode")]
    public async Task<IActionResult> SwitchDevMode()
    {
        var user = await _userService.GetUserProfileAsync(UserId);

        if (user == null)
        {
            return NotFound("用户不存在");
        }

        // 首先尝试从Claims中获取开发者模式状态
        var devModeClaim = User.FindFirst("DevMode");
        var isDevMode = devModeClaim != null && devModeClaim.Value.ToLower() == "true";

        // 如果Claims中没有，再尝试从Cookie获取
        if (devModeClaim == null && HttpContext.Request.Cookies.TryGetValue(DEV_MODE_COOKIE, out var devModeCookie))
        {
            isDevMode = devModeCookie.ToLower() == "true";
        }

        // 切换开发者模式
        bool newDevMode = !isDevMode;

        System.Console.WriteLine($"Current DevMode: {isDevMode}, Switching to: {newDevMode}");

        // 更新用户实体的开发者模式状态
        user.IsDevMode = newDevMode;

        // 更新认证信息和Cookie
        await SignInUserAsync(user);

        return Ok(new { success = true, message = $"已切换为{(newDevMode ? "开发者" : "使用者")}模式" });
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