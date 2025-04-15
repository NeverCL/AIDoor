using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Authorization;
using System.IO;

namespace AIDoor.WebAPI.Controllers;

public class FileController : BaseController
{
    private readonly FileService _fileService;
    private readonly FileExtensionContentTypeProvider _contentTypeProvider;

    public FileController(FileService fileService)
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
        if (!result.Success)
        {
            return BadRequest(result.ErrorMessage);
        }

        // 返回文件ID和访问URL
        string fileUrl = Url.Action(nameof(GetFile), "File", new { fileName = result.FileName }, Request.Scheme);
        return Ok("文件上传成功", new { fileName = result.FileName, fileUrl });
    }

    [HttpGet("preview/{fileName}")]
    public IActionResult PreviewFile(string fileName)
    {
        var result = _fileService.GetFilePath(fileName);
        if (!result.Success)
        {
            return BadRequest(result.ErrorMessage);
        }

        if (!_contentTypeProvider.TryGetContentType(result.FilePath, out string contentType))
        {
            contentType = "application/octet-stream";
        }

        // 指定文件应该显示在浏览器中，而不是下载
        return PhysicalFile(result.FilePath, contentType, enableRangeProcessing: true);
    }

    [HttpGet("download/{fileName}")]
    public IActionResult GetFile(string fileName)
    {
        var result = _fileService.GetFilePath(fileName);
        if (!result.Success)
        {
            return BadRequest(result.ErrorMessage);
        }

        if (!_contentTypeProvider.TryGetContentType(result.FilePath, out string contentType))
        {
            contentType = "application/octet-stream";
        }

        // 使用原始文件名下载文件
        return PhysicalFile(result.FilePath, contentType, Path.GetFileName(fileName));
    }

    [HttpDelete("{fileName}")]
    public IActionResult DeleteFile(string fileName)
    {
        bool deleted = _fileService.DeleteFile(fileName);
        if (!deleted)
        {
            return BadRequest("文件删除失败");
        }

        return Ok("文件删除成功");
    }
}

public record UploadFileResponse(string FileName, string FileUrl); 