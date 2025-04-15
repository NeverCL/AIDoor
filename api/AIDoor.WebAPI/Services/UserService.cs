using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;

namespace AIDoor.WebAPI.Services;

public class UserService
{
    private readonly AppDbContext _context;
    private readonly SmsService _smsService;
    private readonly IDistributedCache _cache;
    private const int VERIFICATION_CODE_EXPIRE_MINUTES = 5;

    public UserService(AppDbContext context, SmsService smsService, IDistributedCache cache)
    {
        _context = context;
        _smsService = smsService;
        _cache = cache;
    }

    public async Task<bool> IsPhoneRegisteredAsync(string phoneNumber)
    {
        return await _context.Users.AnyAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<(bool Success, string Message)> RegisterAsync(string phoneNumber, string password, string verificationCode)
    {
        // 验证短信验证码
        var cachedCode = await _cache.GetStringAsync($"verification_code:{phoneNumber}");
        if (cachedCode == null || cachedCode != verificationCode)
        {
            return (false, "验证码无效或已过期");
        }
        
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
        
        // 存储验证码到Redis，设置5分钟过期时间
        await _cache.SetStringAsync(
            $"verification_code:{phoneNumber}",
            code,
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(VERIFICATION_CODE_EXPIRE_MINUTES)
            }
        );
        
        // 发送验证码短信
        _smsService.SendCode(phoneNumber, code);
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