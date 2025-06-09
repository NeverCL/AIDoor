using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Controllers;

public class AppItemController : BaseController
{
    private readonly AppItemService _appItemService;
    private readonly UserRecordService _recordService;

    public AppItemController(AppItemService appItemService, UserRecordService recordService)
    {
        _appItemService = appItemService;
        _recordService = recordService;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllCategoriesWithApplications()
    {
        var categories = await _appItemService.GetApplicationCategories();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppItemById(int id)
    {
        var appItem = await _appItemService.GetApplicationById(id);

        if (appItem == null)
        {
            return NotFound();
        }

        // 创建浏览记录
        var recordDto = new UserRecordCreateDto
        {
            RecordType = RecordType.AppFootprint,
            Title = appItem.Title,
            ImageUrl = appItem.ImageUrl,
            TargetId = id
        };

        await _recordService.CreateRecordAsync(recordDto);

        // 获取应用的总浏览次数
        int viewCount = await _recordService.GetAppViewCountAsync(id);

        return Ok(new
        {
            app = appItem,
            stats = new
            {
                viewCount = viewCount
            }
        });
    }
}