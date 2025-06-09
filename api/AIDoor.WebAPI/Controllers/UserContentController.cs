using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AIDoor.WebAPI.Controllers;

[Authorize]
public class UserContentController : BaseController
{
    private readonly UserContentService _contentService;
    private readonly UserRecordService _recordService;


    public UserContentController(UserContentService contentService, UserRecordService recordService)
    {
        _contentService = contentService;
        _recordService = recordService;
    }

    [HttpGet]
    public async Task<IActionResult> GetContents([FromQuery] UserContentQueryParams queryParams)
    {
        var (contents, totalCount) = await _contentService.GetContentsAsync(queryParams);

        return Ok(new
        {
            contents,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetContentById(int id)
    {
        var content = await _contentService.GetContentByIdAsync(id);
        if (content == null)
        {
            return NotFound("未找到指定内容");
        }

        // 获取内容的统计数据（点赞数、收藏数、评论数）
        var stats = await _contentService.GetContentStatsAsync(id);

        // 检查当前用户是否已关注内容作者
        bool isFollowing = false;
        try
        {
            var userFollowService = HttpContext.RequestServices.GetRequiredService<UserFollowService>();
            if (content.PublisherId != 0) // 确保有有效的作者ID
            {
                isFollowing = await userFollowService.IsFollowingAsync(content.PublisherId);
            }
        }
        catch (Exception ex)
        {
            // 记录错误但不中断流程
            var logger = HttpContext.RequestServices.GetRequiredService<ILogger<UserContentController>>();
            logger.LogError(ex, "检查关注状态失败");
        }

        // 创建响应对象
        var response = new
        {
            Content = content,
            Stats = stats,
            IsFollowing = isFollowing
        };

        // 创建浏览记录
        var recordDto = new UserRecordCreateDto
        {
            RecordType = RecordType.ContentFootprint,
            Title = content.Title,
            ImageUrl = GetImageUrl(content.Images[0]),
            TargetId = id
        };

        var recordResult = await _recordService.CreateRecordAsync(recordDto);

        // 更新统计数据中的浏览数，添加本次浏览
        if (recordResult.Success && recordResult.RecordId > 0)
        {
            stats.ViewsCount++;
        }

        return Ok(response);
    }

    private string GetImageUrl(string image)
    {
        if (string.IsNullOrEmpty(image))
        {
            return string.Empty;
        }

        return UserContentService.videoExtensions.Contains(Path.GetExtension(image))
            ? "preview/" + Path.ChangeExtension(image, ".png")
            : image;
    }

    [HttpPost]
    public async Task<IActionResult> CreateContent([FromBody] UserContentCreateDto contentDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的内容信息");
        }

        var result = await _contentService.CreateContentAsync(contentDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return CreatedAtAction(nameof(GetContentById), new { id = result.ContentId },
            new { message = result.Message, contentId = result.ContentId });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteContent(int id)
    {
        var result = await _contentService.DeleteContentAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }
}