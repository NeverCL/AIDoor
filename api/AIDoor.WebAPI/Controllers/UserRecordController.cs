using System.ComponentModel.DataAnnotations;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Authorize]
public class UserRecordController : BaseController
{
    private readonly UserRecordService _recordService;
    private readonly UserContentService _contentService;

    public UserRecordController(UserRecordService recordService, UserContentService contentService)
    {
        _recordService = recordService;
        _contentService = contentService;
    }

    /// <summary>
    /// 获取我的页面所需的记录
    /// </summary>
    [HttpGet("my")]
    public async Task<IActionResult> GetMyPageRecords()
    {
        // 获取点赞记录（前3条）
        var (likeRecords, likeCount) = await _recordService.GetRecordsAsync(new UserRecordQueryParams
        {
            Page = 1,
            Limit = 3,
            RecordType = RecordType.Like.ToString()
        });

        // 获取收藏记录（前3条）
        var (favoriteRecords, favoriteCount) = await _recordService.GetRecordsAsync(new UserRecordQueryParams
        {
            Page = 1,
            Limit = 3,
            RecordType = RecordType.Favorite.ToString()
        });

        // 获取内容足迹记录（前3条）
        var (contentFootprintRecords, contentFootprintCount) = await _recordService.GetRecordsAsync(new UserRecordQueryParams
        {
            Page = 1,
            Limit = 3,
            RecordType = RecordType.ContentFootprint.ToString()
        });

        // 获取应用足迹记录（前4条）
        var (appFootprintRecords, appFootprintCount) = await _recordService.GetRecordsAsync(new UserRecordQueryParams
        {
            Page = 1,
            Limit = 4,
            RecordType = RecordType.AppFootprint.ToString()
        });

        return Ok(new
        {
            like = new
            {
                records = likeRecords,
                totalCount = likeCount
            },
            favorite = new
            {
                records = favoriteRecords,
                totalCount = favoriteCount
            },
            contentFootprint = new
            {
                records = contentFootprintRecords,
                totalCount = contentFootprintCount
            },
            appFootprint = new
            {
                records = appFootprintRecords,
                totalCount = appFootprintCount
            }
        });
    }

    /// <summary>
    /// 获取用户记录列表
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetRecords([FromQuery] UserRecordQueryParams queryParams)
    {
        var (records, totalCount) = await _recordService.GetRecordsAsync(queryParams);

        return Ok(new
        {
            records,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    /// <summary>
    /// 创建用户记录
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateRecord([FromBody] UserRecordCreateDto recordDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的记录信息");
        }

        var result = await _recordService.CreateRecordAsync(recordDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok();
    }

    /// <summary>
    /// 查看内容并自动添加浏览记录
    /// </summary>
    [HttpGet("content/{id:int}")]
    public async Task<IActionResult> ViewContent(int id)
    {
        // 先获取内容详情
        var content = await _contentService.GetContentByIdAsync(id);
        if (content == null)
        {
            return NotFound("未找到指定内容");
        }

        // 创建浏览记录
        var recordDto = new UserRecordCreateDto
        {
            RecordType = RecordType.ContentFootprint,
            Title = content.Title,
            ImageUrl = content.Images.Length > 0 ? $"https://cdn.thedoorofai.com/{content.Images[0]}" : string.Empty,
            TargetId = id,
            TargetType = "Content"
        };

        await _recordService.CreateRecordAsync(recordDto);

        // 返回内容详情
        return Ok(content);
    }

    /// <summary>
    /// 访问应用链接并添加浏览记录
    /// </summary>
    [HttpPost("app-visit")]
    public async Task<IActionResult> VisitApp([FromBody] AppVisitDto appVisit)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的应用信息");
        }

        var recordDto = new UserRecordCreateDto
        {
            RecordType = RecordType.AppFootprint,
            Title = appVisit.Title,
            ImageUrl = appVisit.ImageUrl,
            TargetId = appVisit.AppId,
            TargetType = "App",
            Notes = $"App:{appVisit.AppId} - {appVisit.Link}"
        };

        var result = await _recordService.CreateRecordAsync(recordDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(new { message = result.Message, recordId = result.RecordId });
    }

    /// <summary>
    /// 删除用户记录
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRecord(int id)
    {
        var result = await _recordService.DeleteRecordAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    /// <summary>
    /// 清空某类型的所有记录
    /// </summary>
    [HttpDelete("clear/{recordType}")]
    public async Task<IActionResult> ClearRecords(RecordType recordType)
    {
        var result = await _recordService.ClearRecordsAsync(recordType);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    /// <summary>
    /// 清空所有足迹记录
    /// </summary>
    [HttpDelete("clear-footprints")]
    public async Task<IActionResult> ClearAllFootprints()
    {
        var contentResult = await _recordService.ClearRecordsAsync(RecordType.ContentFootprint);
        var appResult = await _recordService.ClearRecordsAsync(RecordType.AppFootprint);

        if (!contentResult.Success || !appResult.Success)
        {
            return BadRequest("清空足迹记录失败");
        }

        return Ok("所有足迹记录已清空");
    }

    /// <summary>
    /// 获取所有足迹记录（包括内容足迹和应用足迹）
    /// 备注：此接口主要用于向后兼容，新版前端应直接使用ContentFootprint和AppFootprint类型
    /// </summary>
    [HttpGet("footprints")]
    public async Task<IActionResult> GetAllFootprints([FromQuery] UserRecordQueryParams queryParams)
    {
        var contentTask = _recordService.GetRecordsAsync(new UserRecordQueryParams
        {
            Page = queryParams.Page,
            Limit = queryParams.Limit / 2, // 平分页面大小
            RecordType = "ContentFootprint"
        });

        var appTask = _recordService.GetRecordsAsync(new UserRecordQueryParams
        {
            Page = queryParams.Page,
            Limit = queryParams.Limit / 2, // 平分页面大小
            RecordType = "AppFootprint"
        });

        await Task.WhenAll(contentTask, appTask);

        var (contentRecords, contentCount) = contentTask.Result;
        var (appRecords, appCount) = appTask.Result;

        // 合并两种足迹并按最后浏览时间排序
        var combinedRecords = contentRecords.Concat(appRecords)
            .OrderByDescending(r => r.LastViewedAt ?? r.CreatedAt)
            .Take(queryParams.Limit)
            .ToList();

        int totalCount = contentCount + appCount;

        return Ok(new
        {
            records = combinedRecords,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }
}

/// <summary>
/// 应用访问记录请求DTO
/// </summary>
public class AppVisitDto
{
    [Required(ErrorMessage = "应用ID不能为空")]
    public int AppId { get; set; }

    [Required(ErrorMessage = "应用标题不能为空")]
    public string Title { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string Link { get; set; } = string.Empty;
}