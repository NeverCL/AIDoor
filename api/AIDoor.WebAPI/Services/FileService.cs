using System;
using System.IO;
using System.Threading.Tasks;
using AIDoor.WebAPI.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace AIDoor.WebAPI.Services;

public class FileService
{
    private readonly string _uploadDirectory;
    private readonly FileStorageOptions _options;
    
    public FileService(IOptions<FileStorageOptions> options)
    {
        _options = options.Value;
        _uploadDirectory = _options.UploadDirectory;
        
        // 确保配置的上传目录存在
        if (!Directory.Exists(_uploadDirectory))
        {
            Directory.CreateDirectory(_uploadDirectory);
        }
    }
    
    public async Task<(bool Success, string FileName, string ErrorMessage)> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return (false, string.Empty, "文件为空");
        }
        
        // Validate file size from options
        if (file.Length > _options.MaxFileSize)
        {
            return (false, string.Empty, "文件大小超过限制");
        }
        
        // Generate a unique filename to prevent overwriting
        string fileExtension = Path.GetExtension(file.FileName);
        string fileName = $"{Guid.NewGuid()}{fileExtension}";
        string filePath = Path.Combine(_uploadDirectory, fileName);
        
        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            return (true, fileName, string.Empty);
        }
        catch (Exception ex)
        {
            return (false, string.Empty, $"文件上传失败: {ex.Message}");
        }
    }
    
    public (bool Success, string FilePath, string ErrorMessage) GetFilePath(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            return (false, string.Empty, "文件名为空");
        }
        
        string filePath = Path.Combine(_uploadDirectory, fileName);
        
        if (!File.Exists(filePath))
        {
            return (false, string.Empty, "文件不存在");
        }
        
        return (true, filePath, string.Empty);
    }
    
    public bool DeleteFile(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            return false;
        }
        
        string filePath = Path.Combine(_uploadDirectory, fileName);
        
        if (!File.Exists(filePath))
        {
            return false;
        }
        
        try
        {
            File.Delete(filePath);
            return true;
        }
        catch
        {
            return false;
        }
    }
} 