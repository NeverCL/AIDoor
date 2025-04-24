using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;
using AIDoor.WebAPI.Dtos;
using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Services;

public class UserService
{
    private readonly AppDbContext _context;
    private readonly SmsService _smsService;
    private readonly IDistributedCache _cache;
    private const int VERIFICATION_CODE_EXPIRE_MINUTES = 5;

    public async Task<User?> GetUserProfileAsync(int userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    public async Task UpdateUserProfileAsync(int userId, string username, string avatarUrl)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return;
        }

        user.Username = username;
        user.AvatarUrl = avatarUrl;
        await _context.SaveChangesAsync();
    }

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

    public async Task<(bool Success, string Message)> RegisterAsync(string phoneNumber, string password, string verificationCode, string name)
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
            Username = name, // 使用用户提供的昵称
            PasswordHash = passwordHash,
            CreatedAt = DateTime.Now
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return (true, "注册成功");
    }

    /// <summary>
    /// 生成随机密码
    /// </summary>
    /// <returns>随机生成的密码</returns>
    private string GenerateRandomPassword()
    {
        // 生成包含字母和数字的随机密码
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        var password = new string(Enumerable.Repeat(chars, 12)
            .Select(s => s[random.Next(s.Length)]).ToArray());

        return password;
    }

    public async Task<(bool Success, User? User, string Message)> LoginAsync(string phone, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phone);

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

    public async Task<(bool Success, User? User, string Message)> LoginWithCodeAsync(string phone, string code)
    {
        // 验证短信验证码
        var cachedCode = await _cache.GetStringAsync($"verification_code:{phone}");
        if (cachedCode == null || cachedCode != code)
        {
            return (false, null, "验证码无效或已过期");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phone);

        if (user == null)
        {
            return (false, null, "用户不存在，请先注册");
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

        code = "123123";

        // 存储验证码到Redis，设置5分钟过期时间
        await _cache.SetStringAsync(
            $"verification_code:{phoneNumber}",
            code,
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(VERIFICATION_CODE_EXPIRE_MINUTES)
            }
        );

        System.Console.WriteLine($"验证码: {code}-{phoneNumber}");

        // 发送验证码短信
        _smsService.SendCode(phoneNumber, code);
    }

    private string GenerateRandomCode()
    {
        // 生成6位数字验证码
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    /// <summary>
    /// 生成随机昵称
    /// </summary>
    /// <returns>随机生成的昵称</returns>
    public string GenerateRandomNickname()
    {
        string[] adjectives = { "快乐", "聪明", "可爱", "帅气", "美丽", "勇敢", "温柔", "善良", "优雅", "活泼" };
        string[] nouns = { "小猫", "小狗", "小鸟", "小熊", "小兔", "小鹿", "小象", "小狮", "小虎", "小龙" };

        var random = new Random();
        string adjective = adjectives[random.Next(adjectives.Length)];
        string noun = nouns[random.Next(nouns.Length)];

        return $"{adjective}{noun}{random.Next(100, 999)}";
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

    /// <summary>
    /// 获取用户的消息和关注统计数据
    /// </summary>
    /// <param name="userId">用户ID</param>
    /// <returns>包含消息数量和关注数量的对象</returns>
    public async Task<UserStats?> GetUserStatsAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return null;
        }

        // 从数据库获取实际的消息数和关注数

        // 假设有一个消息表，可以统计未读消息数量
        // 这里使用点赞数量作为消息数量的替代，实际项目中应当根据消息表来查询
        var messageCount = await _context.UserRecords
            .Where(ur => ur.UserId == userId && ur.RecordType == RecordType.Like && ur.IsActive)
            .CountAsync();

        // 假设有一个关注表，可以统计关注数量
        // 这里使用收藏数量作为关注数量的替代，实际项目中应当根据关注表来查询
        var followCount = await _context.UserRecords
            .Where(ur => ur.UserId == userId && ur.RecordType == RecordType.Favorite && ur.IsActive)
            .CountAsync();

        return new UserStats
        {
            MessageCount = messageCount,
            FollowCount = followCount
        };
    }

    /// <summary>
    /// 获取用户的记录数据（点赞、收藏、足迹）
    /// </summary>
    /// <param name="userId">用户ID</param>
    /// <returns>用户记录数据列表</returns>
    public async Task<List<UserRecordTypeDto>> GetUserRecordsAsync(int userId)
    {
        // 验证用户是否存在
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return new List<UserRecordTypeDto>();
        }

        var result = new List<UserRecordTypeDto>();

        // 获取所有用户记录数据
        var userRecords = await _context.UserRecords
            .Where(ur => ur.UserId == userId && ur.IsActive)
            .OrderByDescending(ur => ur.CreatedAt)
            .ToListAsync();

        // 按记录类型分组
        var recordsByType = userRecords
            .GroupBy(ur => ur.RecordType)
            .ToDictionary(g => g.Key, g => g.ToList());

        // 处理点赞记录
        if (recordsByType.TryGetValue(RecordType.Like, out var likes) && likes.Any())
        {
            result.Add(new UserRecordTypeDto
            {
                Type = "like",
                Data = likes.Select(like => new UserRecordItemDto
                {
                    Id = like.Id,
                    Img = like.ImageUrl,
                    Title = like.Title,
                    CreatedAt = like.CreatedAt
                }).ToList()
            });
        }
        else
        {
            // 如果没有数据，添加空列表
            result.Add(new UserRecordTypeDto
            {
                Type = "like",
                Data = new List<UserRecordItemDto>()
            });
        }

        // 处理收藏记录
        if (recordsByType.TryGetValue(RecordType.Favorite, out var favorites) && favorites.Any())
        {
            result.Add(new UserRecordTypeDto
            {
                Type = "favorite",
                Data = favorites.Select(favorite => new UserRecordItemDto
                {
                    Id = favorite.Id,
                    Img = favorite.ImageUrl,
                    Title = favorite.Title,
                    CreatedAt = favorite.CreatedAt
                }).ToList()
            });
        }
        else
        {
            // 如果没有数据，添加空列表
            result.Add(new UserRecordTypeDto
            {
                Type = "favorite",
                Data = new List<UserRecordItemDto>()
            });
        }

        // 处理足迹记录，按最后浏览时间排序
        if (recordsByType.TryGetValue(RecordType.Footprint, out var footprints) && footprints.Any())
        {
            result.Add(new UserRecordTypeDto
            {
                Type = "footprint",
                Data = footprints
                    .OrderByDescending(f => f.LastViewedAt)
                    .Select(footprint => new UserRecordItemDto
                    {
                        Id = footprint.Id,
                        Img = footprint.ImageUrl,
                        Title = footprint.Title,
                        CreatedAt = footprint.CreatedAt
                    }).ToList()
            });
        }
        else
        {
            // 如果没有数据，添加空列表
            result.Add(new UserRecordTypeDto
            {
                Type = "footprint",
                Data = new List<UserRecordItemDto>()
            });
        }

        return result;
    }
}

/// <summary>
/// 用户统计数据模型
/// </summary>
public class UserStats
{
    /// <summary>
    /// 未读消息数量
    /// </summary>
    public int MessageCount { get; set; }

    /// <summary>
    /// 关注数量
    /// </summary>
    public int FollowCount { get; set; }
}