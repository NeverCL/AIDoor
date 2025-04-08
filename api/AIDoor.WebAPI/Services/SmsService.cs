namespace AIDoor.WebAPI.Services;

// https://next.api.aliyun.com/api/Dysmsapi/2018-05-01/SendMessageWithTemplate?params={%22From%22:%22%22}
public class SmsService
{
    public void SendCode(string phone, string code)
    {
        AlibabaCloud.SDK.Dysmsapi20170525.Client client = CreateClient();
        AlibabaCloud.SDK.Dysmsapi20170525.Models.SendSmsRequest sendSmsRequest = new AlibabaCloud.SDK.Dysmsapi20170525.Models.SendSmsRequest
        {
            SignName = "阿里云通信",
            TemplateCode = "SMS_316440154",
            PhoneNumbers = "17090413576",
            TemplateParam = "{\"code\":\"1234\"}",
        };
        AlibabaCloud.TeaUtil.Models.RuntimeOptions runtime = new AlibabaCloud.TeaUtil.Models.RuntimeOptions();
        try
        {
            // 复制代码运行请自行打印 API 的返回值
            var res = client.SendSmsWithOptions(sendSmsRequest, runtime);
        }
        catch (Exception error)
        {
            // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
            // 错误 message
            Console.WriteLine(error.Message);
            // 诊断地址
            Console.WriteLine(error.Data["Recommend"]);
            AlibabaCloud.TeaUtil.Common.AssertAsString(error.Message);
        }
    }
    
    AlibabaCloud.SDK.Dysmsapi20170525.Client CreateClient()
    {
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
        // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378671.html。
        AlibabaCloud.OpenApiClient.Models.Config config = new AlibabaCloud.OpenApiClient.Models.Config
        {
            // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
            AccessKeyId = Environment.GetEnvironmentVariable("ALIBABA_CLOUD_ACCESS_KEY_ID"),
            // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
            AccessKeySecret = Environment.GetEnvironmentVariable("ALIBABA_CLOUD_ACCESS_KEY_SECRET"),
        };
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.Endpoint = "dysmsapi.aliyuncs.com";
        return new AlibabaCloud.SDK.Dysmsapi20170525.Client(config);
    }
}