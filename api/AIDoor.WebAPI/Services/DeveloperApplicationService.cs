using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIDoor.WebAPI.Services;

/// <summary>
/// 开发者申请服务
/// </summary>
public class DeveloperApplicationService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<DeveloperApplicationService> _logger;
    private readonly UserService _userService;

    public DeveloperApplicationService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<DeveloperApplicationService> logger,
        UserService userService)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _userService = userService;
    }

    /// <summary>
    /// 获取当前登录用户ID
    /// </summary>
    private int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("未登录或无法识别用户");
        }
        return userId;
    }

    /// <summary>
    /// 提交开发者申请
    /// </summary>
    /// <param name="dto">申请信息</param>
    /// <returns>提交结果</returns>
    public async Task<(bool Success, string Message)> SubmitApplicationAsync(DeveloperApplicationCreateDto dto)
    {
        // 检查是否有待审核或已通过的申请
        var existingApplication = await _context.DeveloperApplications
            .Where(a => a.UserId == GetCurrentUserId())
            .OrderByDescending(a => a.CreatedAt)
            .FirstOrDefaultAsync();

        if (existingApplication != null &&
            (existingApplication.Status == DeveloperApplicationStatus.Pending ||
             existingApplication.Status == DeveloperApplicationStatus.Approved))
        {
            var message = existingApplication.Status == DeveloperApplicationStatus.Pending
                    ? "您已有一个正在审核中的申请"
                    : "您的申请已被批准，无需再次申请";

            return (false, message);
        }

        // 创建新申请
        var application = new DeveloperApplication
        {
            UserId = GetCurrentUserId(),
            Name = dto.Name,
            Logo = dto.Logo,
            Description = dto.Description,
            Website = dto.Website,
            Company = dto.Company,
            Category = dto.Category,
            UserType = dto.UserType,
            Stage = dto.Stage,
            Status = DeveloperApplicationStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.DeveloperApplications.Add(application);
        await _context.SaveChangesAsync();

        return (true, "申请已提交，请等待审核");
    }

    /// <summary>
    /// 获取当前用户的申请状态
    /// </summary>
    /// <returns>申请状态</returns>
    public async Task<DeveloperApplicationStatusDto> GetApplicationStatusAsync()
    {
        var userId = GetCurrentUserId();

        return await _userService.GetDeveloperApplicationStatusAsync(userId);
    }

    /// <summary>
    /// 根据ID获取申请详情
    /// </summary>
    /// <param name="id">申请ID</param>
    /// <returns>申请详情</returns>
    public async Task<DeveloperApplicationDto?> GetApplicationByIdAsync(int id)
    {
        var userId = GetCurrentUserId();

        var application = await _context.DeveloperApplications
            .Where(a => a.Id == id && a.UserId == userId)
            .Select(a => new DeveloperApplicationDto
            {
                Id = a.Id,
                UserId = a.UserId,
                Name = a.Name,
                Logo = a.Logo,
                Description = a.Description,
                Website = a.Website,
                Company = a.Company,
                Category = a.Category,
                UserType = a.UserType,
                Stage = a.Stage,
                Status = a.Status,
            })
            .FirstOrDefaultAsync();

        return application;
    }

    /// <summary>
    /// 获取状态文本
    /// </summary>
    /// <param name="status">申请状态</param>
    /// <returns>中文状态描述</returns>
    private static string GetStatusText(DeveloperApplicationStatus status)
    {
        return status switch
        {
            DeveloperApplicationStatus.Pending => "审核中",
            DeveloperApplicationStatus.Approved => "已通过",
            DeveloperApplicationStatus.Rejected => "已拒绝",
            _ => "未知状态"
        };
    }
}