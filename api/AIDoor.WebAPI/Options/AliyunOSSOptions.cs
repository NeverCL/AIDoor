namespace AIDoor.WebAPI.Options;

public class AliyunOSSOptions
{
    public const string AliyunOSS = "AliyunOSS";

    public string Endpoint { get; set; } = "https://oss-cn-beijing.aliyuncs.com";
    public string AccessKeyId { get; set; } = "LTAI5tNAXNky8uG8xsuqTCBk";
    public string AccessKeySecret { get; set; } = "FjpFHalzTPs9X78yVaX42j68Vj7mBP";
    public string BucketName { get; set; } = "bj-app-file";
}