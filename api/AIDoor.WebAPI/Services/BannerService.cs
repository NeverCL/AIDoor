using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AIDoor.WebAPI.Services;

public class BannerService
{
    private readonly AppDbContext _dbContext;

    public BannerService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // 获取所有Banner（包括已禁用的，管理员可访问）
    public async Task<List<BannerDto>> GetAllBanners()
    {
        var banners = await _dbContext.Banners
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return banners.Select(b => new BannerDto
        {
            Id = b.Id,
            Title = b.Title,
            BannerImageUrl = b.BannerImageUrl,
            QrCodeImageUrl = b.QrCodeImageUrl,
            IsActive = b.IsActive,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        }).ToList();
    }

    // 获取活跃的Banner列表（前台使用）
    public async Task<List<BannerDto>> GetActiveBanners()
    {
        var banners = await _dbContext.Banners
            .Where(b => b.IsActive)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return banners.Select(b => new BannerDto
        {
            Id = b.Id,
            Title = b.Title,
            BannerImageUrl = b.BannerImageUrl,
            QrCodeImageUrl = b.QrCodeImageUrl,
            IsActive = b.IsActive,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        }).ToList();
    }

    // 根据ID获取Banner
    public async Task<BannerDto?> GetBannerById(int id)
    {
        var banner = await _dbContext.Banners
            .FirstOrDefaultAsync(b => b.Id == id);

        if (banner == null)
            return null;

        return new BannerDto
        {
            Id = banner.Id,
            Title = banner.Title,
            BannerImageUrl = banner.BannerImageUrl,
            QrCodeImageUrl = banner.QrCodeImageUrl,
            IsActive = banner.IsActive,
            CreatedAt = banner.CreatedAt,
            UpdatedAt = banner.UpdatedAt
        };
    }

    // 创建Banner
    public async Task<(bool Success, int BannerId, string Message)> CreateBanner(BannerCreateDto bannerDto)
    {
        try
        {
            var banner = new Banner
            {
                Title = bannerDto.Title,
                BannerImageUrl = bannerDto.BannerImageUrl,
                QrCodeImageUrl = bannerDto.QrCodeImageUrl,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _dbContext.Banners.Add(banner);
            await _dbContext.SaveChangesAsync();

            return (true, banner.Id, "Banner创建成功");
        }
        catch (Exception ex)
        {
            return (false, 0, $"创建Banner失败: {ex.Message}");
        }
    }

    // 更新Banner
    public async Task<(bool Success, string Message)> UpdateBanner(int bannerId, BannerUpdateDto bannerDto)
    {
        try
        {
            var banner = await _dbContext.Banners.FindAsync(bannerId);
            if (banner == null)
            {
                return (false, "未找到指定Banner");
            }

            banner.Title = bannerDto.Title;
            banner.BannerImageUrl = bannerDto.BannerImageUrl;
            banner.QrCodeImageUrl = bannerDto.QrCodeImageUrl;
            banner.IsActive = bannerDto.IsActive;
            banner.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return (true, "Banner更新成功");
        }
        catch (Exception ex)
        {
            return (false, $"更新Banner失败: {ex.Message}");
        }
    }

    // 删除Banner（软删除，将IsActive设为false）
    public async Task<(bool Success, string Message)> DeleteBanner(int bannerId)
    {
        try
        {
            var banner = await _dbContext.Banners.FindAsync(bannerId);
            if (banner == null)
            {
                return (false, "未找到指定Banner");
            }

            banner.IsActive = false;
            banner.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return (true, "Banner删除成功");
        }
        catch (Exception ex)
        {
            return (false, $"删除Banner失败: {ex.Message}");
        }
    }
}