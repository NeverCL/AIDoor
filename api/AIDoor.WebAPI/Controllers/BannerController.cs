using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Route("api/banners")]
public class BannerController : BaseController
{
    private readonly BannerService _bannerService;

    public BannerController(BannerService bannerService)
    {
        _bannerService = bannerService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetActiveBanners()
    {
        var banners = await _bannerService.GetActiveBanners();
        return Ok(null, banners);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBannerById(int id)
    {
        var banner = await _bannerService.GetBannerById(id);
        if (banner == null || !banner.IsActive)
        {
            return NotFound("未找到指定Banner");
        }

        return Ok(null, banner);
    }
}