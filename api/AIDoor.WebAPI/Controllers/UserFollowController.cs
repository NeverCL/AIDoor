using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

/// <summary>
/// 用户关注关系控制器
/// </summary>
[Authorize]
public class UserFollowController : BaseController
{
    private readonly UserFollowService _followService;

    public UserFollowController(UserFollowService followService)
    {
        _followService = followService;
    }

    /// <summary>
    /// 关注用户
    /// </summary>
    /// <param name="dto">关注请求数据</param>
    /// <returns>关注结果</returns>
    [HttpPost]
    public async Task<IActionResult> FollowUser([FromBody] UserFollowCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的关注信息");
        }

        var result = await _followService.FollowUserAsync(dto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(new { message = result.Message, data = result.Data });
    }

    /// <summary>
    /// 取消关注用户
    /// </summary>
    /// <param name="id">要取消关注的用户ID</param>
    /// <returns>取消关注结果</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> UnfollowUser(int id)
    {
        var result = await _followService.UnfollowUserAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    /// <summary>
    /// 获取当前用户的关注列表
    /// </summary>
    /// <param name="queryParams">查询参数</param>
    /// <returns>关注列表</returns>
    [HttpGet]
    public async Task<IActionResult> GetFollowings([FromQuery] UserFollowQueryParams queryParams)
    {
        var (follows, totalCount) = await _followService.GetFollowingListAsync(queryParams);

        return Ok(new
        {
            follows,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    /// <summary>
    /// 检查是否已关注指定用户
    /// </summary>
    /// <param name="id">被检查的用户ID</param>
    /// <returns>是否已关注</returns>
    [HttpGet("check/{id:int}")]
    public async Task<IActionResult> CheckFollowStatus(int id)
    {
        bool isFollowing = await _followService.IsFollowingAsync(id);
        return Ok(new { isFollowing });
    }
}