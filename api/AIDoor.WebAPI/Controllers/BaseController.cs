using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
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