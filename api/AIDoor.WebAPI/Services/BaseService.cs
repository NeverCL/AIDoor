using System.Security.Claims;
using AIDoor.WebAPI.Data;

namespace AIDoor.WebAPI.Services;

public abstract class BaseService
{
    protected readonly AppDbContext _context;
    protected readonly IHttpContextAccessor _httpContextAccessor;

    protected BaseService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    // 获取当前登录用户ID
    protected int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("未登录或无法识别用户");
        }

        return userId;
    }

    protected int? GetCurrentPublisherId()
    {
        var publisherIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Sid);
        
        if (publisherIdClaim == null)
        {
            throw new UnauthorizedAccessException("未登录或无法识别用户，重新登录试试");
        }

        return int.TryParse(publisherIdClaim.Value, out int publisherId) ? publisherId : null;
    }
}