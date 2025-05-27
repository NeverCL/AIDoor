using AIDoor.WebAPI.Options;
using Microsoft.Extensions.Options;
using Aliyun.OSS;

namespace AIDoor.WebAPI.Services;

public class AliFileService
{
    private readonly ILogger<AliFileService> _logger;
    private readonly OssClient _ossClient;
    private readonly string _bucketName;
    private readonly AliyunOSSOptions _ossOptions;

    public AliFileService(
        IOptions<AliyunOSSOptions> ossOptions,
        ILogger<AliFileService> logger)
    {
        _logger = logger;
        _ossOptions = ossOptions.Value;

        // 从 Options 中获取阿里云OSS的配置
        _bucketName = _ossOptions.BucketName;

        if (string.IsNullOrEmpty(_ossOptions.Endpoint))
            throw new ArgumentNullException("Endpoint", "阿里云OSS端点未配置");

        if (string.IsNullOrEmpty(_ossOptions.AccessKeyId))
            throw new ArgumentNullException("AccessKeyId", "阿里云AccessKeyId未配置");

        if (string.IsNullOrEmpty(_ossOptions.AccessKeySecret))
            throw new ArgumentNullException("AccessKeySecret", "阿里云AccessKeySecret未配置");

        if (string.IsNullOrEmpty(_bucketName))
            throw new ArgumentNullException("BucketName", "阿里云OSS存储桶名称未配置");

        // 创建OssClient实例
        _ossClient = new OssClient(
            _ossOptions.Endpoint,
            _ossOptions.AccessKeyId,
            _ossOptions.AccessKeySecret);

        // 确保存储桶存在
        // EnsureBucketExists();
    }

    private void EnsureBucketExists()
    {
        try
        {
            var data = _ossClient.ListObjects(_bucketName);
            if (!_ossClient.DoesBucketExist(_bucketName))
            {
                _logger.LogWarning("Bucket {BucketName} does not exist", _bucketName);
                // 在实际应用中，可能会选择抛出异常或者自动创建存储桶
                // _ossClient.CreateBucket(_bucketName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking or creating bucket {BucketName}", _bucketName);
            throw;
        }
    }

    static HashSet<string> videoExtensions = new HashSet<string> { ".mp4", ".avi", ".mov", ".wmv", ".flv", ".mpeg", ".mpg", ".m4v", ".webm", ".mkv" };

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new Exception("文件为空");
        }

        // 验证文件大小
        if (file.Length > _ossOptions.MaxFileSize)
        {
            throw new Exception($"文件大小超过限制 ({_ossOptions.MaxFileSize / 1024 / 1024}MB)");
        }

        // 生成唯一的文件名
        string fileExtension = Path.GetExtension(file.FileName);

        string objectKey = $"{DateTime.Now:yyyyMMdd}/{Guid.NewGuid()}{fileExtension}";

        // isVideo

        var isVideo = videoExtensions.Contains(fileExtension);

        if (isVideo)
        {
            objectKey = "video/" + objectKey;
        }

        using (var stream = file.OpenReadStream())
        {
            // 上传到OSS
            _ossClient.PutObject(_bucketName, objectKey, stream);
        }

        // // isVideo 文件扩展名更换为mp4
        // if (isVideo)
        // {
        //     objectKey = "imm/" + objectKey.Replace(fileExtension, ".mp4");
        // }

        return objectKey;
    }

    public (bool Success, string Url, string ErrorMessage) GetFileUrl(string objectKey, int expireMinutes = 60)
    {
        if (string.IsNullOrEmpty(objectKey))
        {
            return (false, string.Empty, "文件名为空");
        }

        try
        {
            // 检查文件是否存在
            if (!_ossClient.DoesObjectExist(_bucketName, objectKey))
            {
                return (false, string.Empty, "文件不存在");
            }

            // 生成签名URL
            var req = new GeneratePresignedUriRequest(_bucketName, objectKey, SignHttpMethod.Get)
            {
                Expiration = DateTime.Now.AddMinutes(expireMinutes)
            };

            var uri = _ossClient.GeneratePresignedUri(req);
            return (true, uri.ToString(), string.Empty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating file URL for {ObjectKey}", objectKey);
            return (false, string.Empty, $"获取文件访问URL失败: {ex.Message}");
        }
    }

    public bool DeleteFile(string objectKey)
    {
        if (string.IsNullOrEmpty(objectKey))
        {
            return false;
        }

        try
        {
            if (!_ossClient.DoesObjectExist(_bucketName, objectKey))
            {
                return false;
            }

            _ossClient.DeleteObject(_bucketName, objectKey);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file {ObjectKey}", objectKey);
            return false;
        }
    }

    public (bool Success, Stream? Content, string ErrorMessage) GetFileStream(string objectKey)
    {
        if (string.IsNullOrEmpty(objectKey))
        {
            return (false, null, "文件名为空");
        }

        try
        {
            if (!_ossClient.DoesObjectExist(_bucketName, objectKey))
            {
                return (false, null, "文件不存在");
            }

            var ossObject = _ossClient.GetObject(_bucketName, objectKey);
            return (true, ossObject.Content, string.Empty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file {ObjectKey}", objectKey);
            return (false, null, $"获取文件内容失败: {ex.Message}");
        }
    }
}
