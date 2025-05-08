using System.Security.Claims;

namespace Microsoft.AspNetCore.Mvc
{
    /// <summary>
    /// HttpContext扩展方法
    /// </summary>
    public static class HttpContextExtensions
    {
        /// <summary>
        /// 从HttpContext中获取当前用户ID
        /// </summary>
        /// <param name="httpContext">HttpContext</param>
        /// <returns>用户ID</returns>
        public static int GetUserId(this HttpContext httpContext)
        {
            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("无法获取用户ID");
            }
            return userId;
        }
    }
}