using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

public class AppItemController : BaseController
{
    private readonly ApplicationService _applicationService;

    public AppItemController(ApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllCategoriesWithApplications()
    {
        var categories = await _applicationService.GetApplicationCategories();
        return Ok("获取所有应用分类成功", categories);
    }
} 