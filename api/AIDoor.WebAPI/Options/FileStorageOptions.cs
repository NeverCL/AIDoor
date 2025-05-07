namespace AIDoor.WebAPI.Options;

public class FileStorageOptions
{
    public const string FileStorage = "FileStorage";
    
    public string UploadDirectory { get; set; } = "App_Data/uploads";
    public long MaxFileSize { get; set; } = 100 * 1024 * 1024; // 10MB default
} 