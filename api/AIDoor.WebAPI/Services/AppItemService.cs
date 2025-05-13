using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AIDoor.WebAPI.Services;

public class AppItemService
{
    private readonly AppDbContext _dbContext;

    public AppItemService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // 获取所有应用（包括已禁用的应用，只有管理员可以访问）
    public async Task<List<ApplicationDto>> GetAllApplications()
    {
        var applications = await _dbContext.Applications
            .Include(a => a.Category)
            .OrderBy(a => a.DisplayOrder)
            .ToListAsync();

        return applications.Select(a => new ApplicationDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            ImageUrl = a.ImageUrl,
            Link = a.Link,
            DisplayOrder = a.DisplayOrder,
            CategoryId = a.CategoryId,
            CategoryName = a.Category.Name
        }).ToList();
    }

    // 获取所有应用分类及其应用（只返回激活状态的）
    public async Task<List<CategoryDto>> GetApplicationCategories()
    {
        var categories = await _dbContext.ApplicationCategories
            .Where(c => c.IsActive)
            .Include(c => c.Applications.Where(a => a.IsActive))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                DisplayOrder = c.DisplayOrder,
                Applications = c.Applications.Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    ImageUrl = a.ImageUrl + "?x-oss-process=image/resize,p_30",
                    Link = a.Link,
                    DisplayOrder = a.DisplayOrder,
                    CategoryId = a.CategoryId,
                    CategoryName = c.Name
                }).ToList()
            }).ToList();
    }

    // 根据分类ID获取应用
    public async Task<CategoryDto?> GetCategoryById(int categoryId)
    {
        var category = await _dbContext.ApplicationCategories
            .Include(c => c.Applications.Where(a => a.IsActive))
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.IsActive);

        if (category == null)
            return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            DisplayOrder = category.DisplayOrder,
            Applications = category.Applications.Select(a => new ApplicationDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                ImageUrl = a.ImageUrl,
                Link = a.Link,
                DisplayOrder = a.DisplayOrder,
                CategoryId = a.CategoryId,
                CategoryName = category.Name
            }).ToList()
        };
    }

    // 根据应用ID获取应用详情
    public async Task<ApplicationDetailDto> GetApplicationById(int id)
    {
        var application = await _dbContext.Applications
            .Include(a => a.Category)
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);

        if (application == null)
            return null;

        return new ApplicationDetailDto
        {
            Id = application.Id,
            Title = application.Title,
            Description = application.Description,
            ImageUrl = application.ImageUrl,
            Link = application.Link,
            DisplayOrder = application.DisplayOrder,
            CategoryId = application.CategoryId,
            CategoryName = application.Category.Name,
            Content = application.Content,
            CreatedAt = application.CreatedAt,
            UpdatedAt = application.UpdatedAt
        };
    }

    // 创建应用分类
    public async Task<(bool Success, int CategoryId, string Message)> CreateCategory(CategoryCreateDto categoryDto)
    {
        try
        {
            var category = new AppCategory
            {
                Name = categoryDto.Name,
                DisplayOrder = categoryDto.DisplayOrder,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _dbContext.ApplicationCategories.Add(category);
            await _dbContext.SaveChangesAsync();

            return (true, category.Id, "分类创建成功");
        }
        catch (Exception ex)
        {
            return (false, 0, $"创建分类失败: {ex.Message}");
        }
    }

    // 更新应用分类
    public async Task<(bool Success, string Message)> UpdateCategory(int categoryId, CategoryUpdateDto categoryDto)
    {
        try
        {
            var category = await _dbContext.ApplicationCategories.FindAsync(categoryId);
            if (category == null)
            {
                return (false, "未找到指定分类");
            }

            category.Name = categoryDto.Name;
            category.DisplayOrder = categoryDto.DisplayOrder;
            category.IsActive = categoryDto.IsActive;
            category.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return (true, "分类更新成功");
        }
        catch (Exception ex)
        {
            return (false, $"更新分类失败: {ex.Message}");
        }
    }

    // 删除应用分类（软删除，将IsActive设为false）
    public async Task<(bool Success, string Message)> DeleteCategory(int categoryId)
    {
        try
        {
            var category = await _dbContext.ApplicationCategories.FindAsync(categoryId);
            if (category == null)
            {
                return (false, "未找到指定分类");
            }

            category.IsActive = false;
            category.UpdatedAt = DateTime.Now;

            // 同时将该分类下的所有应用标记为非活动
            var applications = await _dbContext.Applications
                .Where(a => a.CategoryId == categoryId)
                .ToListAsync();

            foreach (var app in applications)
            {
                app.IsActive = false;
                app.UpdatedAt = DateTime.Now;
            }

            await _dbContext.SaveChangesAsync();

            return (true, "分类删除成功");
        }
        catch (Exception ex)
        {
            return (false, $"删除分类失败: {ex.Message}");
        }
    }

    // 创建应用
    public async Task<(bool Success, int ApplicationId, string Message)> CreateApplication(ApplicationCreateDto appDto)
    {
        try
        {
            // 检查分类是否存在
            var categoryExists = await _dbContext.ApplicationCategories
                .AnyAsync(c => c.Id == appDto.CategoryId && c.IsActive);

            if (!categoryExists)
            {
                return (false, 0, "指定的分类不存在或已被禁用");
            }

            var application = new AppItem
            {
                Title = appDto.Title,
                Description = appDto.Description,
                ImageUrl = appDto.ImageUrl,
                DisplayOrder = appDto.DisplayOrder,
                IsActive = true,
                CategoryId = appDto.CategoryId,
                CreatedAt = DateTime.Now
            };

            _dbContext.Applications.Add(application);
            await _dbContext.SaveChangesAsync();

            return (true, application.Id, "应用创建成功");
        }
        catch (Exception ex)
        {
            return (false, 0, $"创建应用失败: {ex.Message}");
        }
    }

    // 更新应用
    public async Task<(bool Success, string Message)> UpdateApplication(int applicationId, ApplicationUpdateDto appDto)
    {
        try
        {
            var application = await _dbContext.Applications.FindAsync(applicationId);
            if (application == null)
            {
                return (false, "未找到指定应用");
            }

            // 检查分类是否存在
            var categoryExists = await _dbContext.ApplicationCategories
                .AnyAsync(c => c.Id == appDto.CategoryId && c.IsActive);

            if (!categoryExists)
            {
                return (false, "指定的分类不存在或已被禁用");
            }

            application.Title = appDto.Title;
            application.Description = appDto.Description;
            application.ImageUrl = appDto.ImageUrl;
            application.DisplayOrder = appDto.DisplayOrder;
            application.IsActive = appDto.IsActive;
            application.CategoryId = appDto.CategoryId;
            application.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return (true, "应用更新成功");
        }
        catch (Exception ex)
        {
            return (false, $"更新应用失败: {ex.Message}");
        }
    }

    // 删除应用（软删除，将IsActive设为false）
    public async Task<(bool Success, string Message)> DeleteApplication(int applicationId)
    {
        try
        {
            var application = await _dbContext.Applications.FindAsync(applicationId);
            if (application == null)
            {
                return (false, "未找到指定应用");
            }

            application.IsActive = false;
            application.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return (true, "应用删除成功");
        }
        catch (Exception ex)
        {
            return (false, $"删除应用失败: {ex.Message}");
        }
    }
}