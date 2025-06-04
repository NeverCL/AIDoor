namespace AIDoor.WebAPI.Services;

// https://next.api.aliyun.com/api/Dysmsapi/2018-05-01/SendMessageWithTemplate?params={%22From%22:%22%22}
public class SmsService
{
    public void SendCode(string phone, int code)
    {
        AlibabaCloud.SDK.Dysmsapi20170525.Client client = CreateClient();
        AlibabaCloud.SDK.Dysmsapi20170525.Models.SendSmsRequest sendSmsRequest =
            new AlibabaCloud.SDK.Dysmsapi20170525.Models.SendSmsRequest
            {
                SignName = "七月流火",
                TemplateCode = "SMS_483765116",
                PhoneNumbers = phone,
                TemplateParam = $"{{\"code\":\"{code}\"}}",
            };
        AlibabaCloud.TeaUtil.Models.RuntimeOptions runtime = new AlibabaCloud.TeaUtil.Models.RuntimeOptions();

        // 复制代码运行请自行打印 API 的返回值
        var res = client.SendSmsWithOptions(sendSmsRequest, runtime);

        if (res.Body.Code != "OK")
            throw new ArgumentException(res.Body.Message);
    }

    AlibabaCloud.SDK.Dysmsapi20170525.Client CreateClient()
    {
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
        // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378671.html。
        AlibabaCloud.OpenApiClient.Models.Config config = new AlibabaCloud.OpenApiClient.Models.Config
        {
            // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
            AccessKeyId = "LTAI5tNAXNky8uG8xsuqTCBk",
            // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
            AccessKeySecret = "FjpFHalzTPs9X78yVaX42j68Vj7mBP",
        };
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.Endpoint = "dysmsapi.aliyuncs.com";
        return new AlibabaCloud.SDK.Dysmsapi20170525.Client(config);
    }
}