using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Authorization;
using System.IO;

namespace AIDoor.WebAPI.Controllers;

public class FileController : BaseController
{
    private readonly AliFileService _fileService;
    private readonly FileExtensionContentTypeProvider _contentTypeProvider;

    public FileController(AliFileService fileService)
    {
        _fileService = fileService;
        _contentTypeProvider = new FileExtensionContentTypeProvider();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null)
        {
            return BadRequest("请选择文件上传");
        }

        var result = await _fileService.UploadFileAsync(file);

        return Ok(new { fileName = result });
    }
}