using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

public class ItemController : BaseController
{
    private readonly ItemService _itemService;

    public ItemController(ItemService itemService)
    {
        _itemService = itemService;
    }

    // GET: api/item - Get a list of items with pagination
    [HttpGet]
    public async Task<IActionResult> GetItems([FromQuery] ItemQueryParams queryParams)
    {
        var (items, totalCount) = await _itemService.GetItemsAsync(queryParams.Page, queryParams.Limit);
        
        return Ok("获取项目列表成功", new { 
            items,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    // GET: api/item/{id} - Get a specific item by ID
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetItemById(int id)
    {
        var item = await _itemService.GetItemByIdAsync(id);
        if (item == null)
        {
            return NotFound("未找到指定项目");
        }
        
        return Ok("获取项目成功", item);
    }

    // POST: api/item - Create a new item (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateItem([FromBody] ItemCreateDto itemDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的项目信息");
        }
        
        var result = await _itemService.CreateItemAsync(itemDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return CreatedAtAction(nameof(GetItemById), new { id = result.ItemId }, 
            new { message = result.Message, itemId = result.ItemId });
    }

    // PUT: api/item/{id} - Update an existing item (Admin only)
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemUpdateDto itemDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的项目信息");
        }
        
        var result = await _itemService.UpdateItemAsync(id, itemDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Message);
    }

    // DELETE: api/item/{id} - Delete an item (Admin only)
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var result = await _itemService.DeleteItemAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Message);
    }
} 