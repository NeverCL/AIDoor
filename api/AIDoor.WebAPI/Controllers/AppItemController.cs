using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AIDoor.WebAPI.Controllers;

public class AppItemController : BaseController
{
    private readonly AppItemService _appItemService;

    public AppItemController(AppItemService appItemService)
    {
        _appItemService = appItemService;
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

        return Ok(appItem);
    }
}