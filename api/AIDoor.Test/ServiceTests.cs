using AIDoor.WebAPI.Services;

namespace AIDoor.Test;

public class ServiceTests
{
    [Fact]
    public void SendCode()
    {
        new SmsService().SendCode("17090413576", "1293812");
    }
}