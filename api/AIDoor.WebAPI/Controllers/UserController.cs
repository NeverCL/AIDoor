using AIDoor.WebAPI.Models;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

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

        // todo 在实际应用中，这里应该生成JWT令牌
        return Ok(result.Message, new
        {
            userId = result.User!.Id,
            phoneNumber = result.User.PhoneNumber,
            username = result.User.Username
        });
    }
}

public record SendCodeRequest(string PhoneNumber);

public record RegisterRequest(string PhoneNumber, string Password, string VerificationCode);

public record LoginRequest(string PhoneNumber, string Password);