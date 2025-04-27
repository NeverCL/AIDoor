using AIDoor.WebAPI.Services;
using AIDoor.WebAPI.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.IO;
using System.Text;

namespace AIDoor.Test;

public class ServiceTests
{
    [Fact]
    public void SendCode()
    {
        new SmsService().SendCode("17090413576", 129381);
    }

    [Fact]
    public async Task UploadFile()
    {
        // 准备测试数据
        var ossOptions = new AliyunOSSOptions
        {
            Endpoint = "https://oss-cn-beijing.aliyuncs.com",
            AccessKeyId = "LTAI5tNAXNky8uG8xsuqTCBk",
            AccessKeySecret = "FjpFHalzTPs9X78yVaX42j68Vj7mBP",
            BucketName = "bj-app-file"
        };

        var fileOptions = new FileStorageOptions
        {
            MaxFileSize = 10 * 1024 * 1024 // 10MB
        };

        // 创建Mock对象
        var mockOssOptions = new Mock<IOptions<AliyunOSSOptions>>();
        mockOssOptions.Setup(o => o.Value).Returns(ossOptions);

        var mockFileOptions = new Mock<IOptions<FileStorageOptions>>();
        mockFileOptions.Setup(o => o.Value).Returns(fileOptions);

        var mockLogger = new Mock<ILogger<AliFileService>>();

        // 创建被测试服务
        var fileService = new AliFileService(
            mockOssOptions.Object,
            mockFileOptions.Object,
            mockLogger.Object
        );

        // 创建模拟的文件
        var fileName = $"test-{Guid.NewGuid()}.txt";
        var content = "这是一个测试文件内容";
        var bytes = Encoding.UTF8.GetBytes(content);

        var formFile = new FormFile(
            baseStream: new MemoryStream(bytes),
            baseStreamOffset: 0,
            length: bytes.Length,
            name: "file",
            fileName: fileName
        );

        // 执行上传
        var result = await fileService.UploadFileAsync(formFile);
    }
}