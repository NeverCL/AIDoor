using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Authorize(Roles = "admin")]
[Route("api/admin/banners")]
public class BannerAdminController : BaseController
{
    private readonly BannerService _bannerService;

    public BannerAdminController(BannerService bannerService)
    {
        _bannerService = bannerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBanners()
    {
        var banners = await _bannerService.GetAllBanners();
        return Ok("获取所有Banner成功", banners);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBannerById(int id)
    {
        var banner = await _bannerService.GetBannerById(id);
        if (banner == null)
        {
            return NotFound("未找到指定Banner");
        }

        return Ok("获取Banner成功", banner);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBanner([FromBody] BannerCreateDto bannerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的Banner信息");
        }

        var result = await _bannerService.CreateBanner(bannerDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return CreatedAtAction(nameof(GetBannerById), new { id = result.BannerId },
            new { message = result.Message, bannerId = result.BannerId });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBanner(int id, [FromBody] BannerUpdateDto bannerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的Banner信息");
        }

        var result = await _bannerService.UpdateBanner(id, bannerDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBanner(int id)
    {
        var result = await _bannerService.DeleteBanner(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }
}