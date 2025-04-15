using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    protected int UserId => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) ? userId : default;
    
    protected IActionResult Ok(string message, object? data = null)
    {
        return base.Ok( data == null
            ? new { message }
            : new { message, data });
    }

    protected IActionResult BadRequest(string message)
    {
        return base.BadRequest(new { message });
    }
}