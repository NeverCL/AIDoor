using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace AIDoor.WebAPI.Services;

public class UserService
{
    private readonly AppDbContext _context;
    private readonly SmsService _smsService;

    public UserService(AppDbContext context, SmsService smsService)
    {
        _context = context;
        _smsService = smsService;
    }

    public async Task<bool> IsPhoneRegisteredAsync(string phoneNumber)
    {
        return await _context.Users.AnyAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<(bool Success, string Message)> RegisterAsync(string phoneNumber, string password, string verificationCode)
    {
        // 在实际应用中，这里应该验证短信验证码
        // 此处简化处理，假设验证码已验证通过
        
        if (await IsPhoneRegisteredAsync(phoneNumber))
        {
            return (false, "手机号已注册");
        }

        // 创建密码哈希
        string passwordHash = HashPassword(password);

        var user = new User
        {
            PhoneNumber = phoneNumber,
            Username = $"user_{DateTime.Now.Ticks}", // 生成默认用户名
            PasswordHash = passwordHash,
            CreatedAt = DateTime.Now
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return (true, "注册成功");
    }

    public async Task<(bool Success, User? User, string Message)> LoginAsync(string phoneNumber, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        
        if (user == null)
        {
            return (false, null, "用户不存在");
        }

        if (!VerifyPassword(password, user.PasswordHash))
        {
            return (false, null, "密码错误");
        }

        // 更新最后登录时间
        user.LastLoginAt = DateTime.Now;
        await _context.SaveChangesAsync();

        return (true, user, "登录成功");
    }

    public async Task SendVerificationCodeAsync(string phoneNumber)
    {
        // 生成随机验证码
        var code = GenerateRandomCode();
        
        // 发送验证码短信
        _smsService.SendCode(phoneNumber, code);
        
        // todo 在实际应用中，应该将验证码存储在缓存或数据库中，并设置过期时间
    }

    private string GenerateRandomCode()
    {
        // 生成6位数字验证码
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] hashBytes = sha256.ComputeHash(passwordBytes);
            return Convert.ToBase64String(hashBytes);
        }
    }

    private bool VerifyPassword(string password, string storedHash)
    {
        string computedHash = HashPassword(password);
        return computedHash == storedHash;
    }
}