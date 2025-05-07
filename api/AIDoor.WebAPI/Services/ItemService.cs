using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace AIDoor.WebAPI.Services;

public class ItemService
{
    private readonly AppDbContext _dbContext;

    public ItemService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Get items with pagination
    public async Task<(List<ItemDto> Items, int TotalCount)> GetItemsAsync(int page, int limit)
    {
        var query = _dbContext.Items
            .Include(i => i.User)
            .AsNoTracking()
            .OrderByDescending(i => i.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(i => new ItemDto
            {
                Id = i.Id,
                Title = i.Title,
                ImageUrl = i.ImageUrl + "?x-oss-process=image/resize,p_30",
                Author = new UserInfoDto
                {
                    Id = i.User.Id,
                    Username = i.User.Username,
                    AvatarUrl = i.User.AvatarUrl
                }
            })
            .ToListAsync();

        return (items, totalCount);
    }

    // Get item by ID
    public async Task<ItemDto?> GetItemByIdAsync(int id)
    {
        var item = await _dbContext.Items
            .Include(i => i.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null) return null;

        return new ItemDto
        {
            Id = item.Id,
            Title = item.Title,
            ImageUrl = item.ImageUrl,
            Author = new UserInfoDto
            {
                Id = item.User.Id,
                Username = item.User.Username,
                AvatarUrl = item.User.AvatarUrl
            }
        };
    }

    // Create a new item
    public async Task<(bool Success, string Message, int? ItemId)> CreateItemAsync(ItemCreateDto itemDto)
    {
        // Verify that the user exists
        var userExists = await _dbContext.Users.AnyAsync(u => u.Id == itemDto.UserId);
        if (!userExists)
        {
            return (false, "指定的用户不存在", null);
        }

        var item = new Item
        {
            Title = itemDto.Title,
            ImageUrl = itemDto.ImageUrl,
            UserId = itemDto.UserId,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _dbContext.Items.Add(item);
            await _dbContext.SaveChangesAsync();
            return (true, "创建项目成功", item.Id);
        }
        catch (Exception ex)
        {
            return (false, $"创建项目失败: {ex.Message}", null);
        }
    }

    // Update an existing item
    public async Task<(bool Success, string Message)> UpdateItemAsync(int id, ItemUpdateDto itemDto)
    {
        var item = await _dbContext.Items
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null)
        {
            return (false, "未找到指定项目");
        }

        if (itemDto.Title != null)
        {
            item.Title = itemDto.Title;
        }

        if (itemDto.ImageUrl != null)
        {
            item.ImageUrl = itemDto.ImageUrl;
        }

        item.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _dbContext.SaveChangesAsync();
            return (true, "更新项目成功");
        }
        catch (Exception ex)
        {
            return (false, $"更新项目失败: {ex.Message}");
        }
    }

    // Delete an item
    public async Task<(bool Success, string Message)> DeleteItemAsync(int id)
    {
        var item = await _dbContext.Items
            .FirstOrDefaultAsync(i => i.Id == id);

        if (item == null)
        {
            return (false, "未找到指定项目");
        }

        try
        {
            _dbContext.Items.Remove(item);
            await _dbContext.SaveChangesAsync();
            return (true, "删除项目成功");
        }
        catch (Exception ex)
        {
            return (false, $"删除项目失败: {ex.Message}");
        }
    }
}