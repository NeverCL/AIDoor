namespace AIDoor.WebAPI.Models;

public class FileStorageOptions
{
    public const string FileStorage = "FileStorage";
    
    public string UploadDirectory { get; set; } = "App_Data/uploads";
    public long MaxFileSize { get; set; } = 10 * 1024 * 1024; // 10MB default
} 