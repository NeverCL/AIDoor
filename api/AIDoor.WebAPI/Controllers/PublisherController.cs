using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

public class PublisherController : BaseController
{
    private readonly PublisherService _publisherService;
    private readonly PublisherRatingService _ratingService;

    public PublisherController(
        PublisherService publisherService,
        UserRecordService userRecordService,
        PublisherRatingService ratingService)
    {
        _publisherService = publisherService;
        _ratingService = ratingService;
    }

    /// <summary>
    /// 获取发布者详情
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <returns>发布者详情</returns>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublisherDetails(int id)
    {
        var publisherDetails = await _publisherService.GetPublisherDetailsAsync(id);

        if (publisherDetails == null)
        {
            return NotFound("未找到该发布者信息");
        }

        // // 普通用户只能查看已审核通过的发布者，除非是自己的
        // if (publisherDetails.Status != PublisherStatus.Approved &&
        //     !User.IsInRole("admin") &&
        //     publisherDetails.Id != UserId)
        // {
        //     return NotFound("该发布者尚未通过审核");
        // }

        return Ok(publisherDetails);
    }

    /// <summary>
    /// 创建或更新发布者信息
    /// </summary>
    /// <param name="model">发布者信息</param>
    /// <returns>操作结果</returns>
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdatePublisher([FromBody] PublisherCreateUpdateRequest model)
    {
        if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.AvatarUrl))
        {
            return BadRequest("名称和头像不能为空");
        }

        var result = await _publisherService.CreateOrUpdatePublisherAsync(
            UserId,
            model.Name,
            model.AvatarUrl,
            model.Description ?? "专注提供智能服务",
            model.Summary,
            model.Type,
            model.Website,
            model.AppLink
        );

        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(new { message = result.Message, publisherId = result.Publisher.Id });
    }

    /// <summary>
    /// 删除发布者
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <returns>操作结果</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePublisher(int id)
    {
        // 先检查该发布者是否与当前用户关联
        var publisher = await _publisherService.GetPublisherDetailsAsync(id);
        if (publisher == null)
        {
            return NotFound("发布者不存在");
        }

        var (success, message) = await _publisherService.DeletePublisherAsync(id);
        if (!success)
        {
            return BadRequest(message);
        }

        return Ok(message);
    }

    /// <summary>
    /// 获取当前用户的发布者信息
    /// </summary>
    /// <returns>发布者信息</returns>
    [HttpGet("my")]
    public async Task<IActionResult> GetMyPublisher()
    {
        // 获取当前用户的发布者信息
        var publisher = await _publisherService.GetPublisherByUserIdAsync(UserId);
        if (publisher == null)
        {
            return NotFound("您还未创建发布者信息");
        }

        // 获取包含统计信息的详细发布者DTO
        var publisherDto = await _publisherService.GetPublisherDetailsAsync(publisher.Id);
        if (publisherDto == null)
        {
            return NotFound("发布者信息获取失败");
        }

        return Ok(publisherDto);
    }

    /// <summary>
    /// 更新发布者统计数据
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <returns>操作结果</returns>
    [HttpPost("{id:int}/refresh-stats")]
    [Authorize(Roles = "admin")] // 只允许管理员手动刷新统计数据
    public async Task<IActionResult> RefreshPublisherStats(int id)
    {
        var success = await _publisherService.UpdatePublisherStatsAsync(id);
        if (!success)
        {
            return BadRequest("更新统计数据失败");
        }

        return Ok("统计数据已更新");
    }

    /// <summary>
    /// 为发布者评分
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <param name="request">评分请求</param>
    /// <returns>评分结果</returns>
    [HttpPost("{id:int}/rate")]
    [Authorize]
    public async Task<IActionResult> RatePublisher(int id, [FromBody] RatePublisherRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的评分信息");
        }

        var result = await _ratingService.RatePublisherAsync(id, request.Rating, request.Comment);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(new { message = result.Message, rating = result.RatingValue });
    }

    /// <summary>
    /// 获取当前用户对发布者的评分
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <returns>用户对该发布者的评分</returns>
    [HttpGet("{id:int}/my-rating")]
    [Authorize]
    public async Task<IActionResult> GetMyRating(int id)
    {
        var rating = await _ratingService.GetUserRatingAsync(id);
        return Ok(rating);
    }

    /// <summary>
    /// 获取发布者的所有评分
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <param name="page">页码</param>
    /// <param name="pageSize">每页数量</param>
    /// <returns>评分列表</returns>
    [HttpGet("{id:int}/ratings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublisherRatings(
        int id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var (ratings, total) = await _ratingService.GetPublisherRatingsAsync(id, page, pageSize);

        return Ok(new
        {
            items = ratings,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    #region 管理员接口

    /// <summary>
    /// 审核发布者申请
    /// </summary>
    /// <param name="id">发布者ID</param>
    /// <param name="request">审核请求</param>
    /// <returns>审核结果</returns>
    [HttpPost("{id:int}/review")]
    [Authorize(Roles = "admin")] // 只允许管理员审核
    public async Task<IActionResult> ReviewPublisher(int id, [FromBody] ReviewPublisherRequest request)
    {
        var (success, message) = await _publisherService.ReviewPublisherAsync(
            id, request.Approved, request.ReviewNote);

        if (!success)
        {
            return BadRequest(message);
        }

        return Ok(message);
    }

    /// <summary>
    /// 获取待审核的发布者列表
    /// </summary>
    /// <param name="page">页码</param>
    /// <param name="pageSize">每页数量</param>
    /// <returns>待审核发布者列表</returns>
    [HttpGet("pending")]
    [Authorize(Roles = "admin")] // 只允许管理员查看
    public async Task<IActionResult> GetPendingPublishers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (publishers, total) = await _publisherService.GetPendingPublishersAsync(page, pageSize);
        return Ok(new
        {
            items = publishers,
            total,
            page,
            pageSize
        });
    }

    /// <summary>
    /// 获取所有发布者列表（可按状态筛选）
    /// </summary>
    /// <param name="page">页码</param>
    /// <param name="pageSize">每页数量</param>
    /// <param name="status">状态筛选</param>
    /// <returns>发布者列表</returns>
    [HttpGet("all")]
    [Authorize(Roles = "admin")] // 只允许管理员查看
    public async Task<IActionResult> GetAllPublishers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] PublisherStatus? status = null)
    {
        var (publishers, total) = await _publisherService.GetAllPublishersAsync(page, pageSize, status);
        return Ok(new
        {
            items = publishers,
            total,
            page,
            pageSize
        });
    }

    #endregion
}

/// <summary>
/// 创建或更新发布者请求模型
/// </summary>
public class PublisherCreateUpdateRequest
{
    /// <summary>
    /// 发布者名称
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 发布者头像
    /// </summary>
    public string AvatarUrl { get; set; } = string.Empty;

    /// <summary>
    /// 发布者描述
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// 发布者简介
    /// </summary>
    public string Summary { get; set; }

    /// <summary>
    /// 发布者类型
    /// </summary>
    public PublisherType Type { get; set; } = PublisherType.Personal;

    /// <summary>
    /// 官网链接
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// 应用链接
    /// </summary>
    public string? AppLink { get; set; }
}

/// <summary>
/// 审核发布者请求模型
/// </summary>
public class ReviewPublisherRequest
{
    /// <summary>
    /// 是否通过审核
    /// </summary>
    public bool Approved { get; set; }

    /// <summary>
    /// 审核备注
    /// </summary>
    public string? ReviewNote { get; set; }
}