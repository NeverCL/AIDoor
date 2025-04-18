using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Extensions;
using AIDoor.WebAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// 注册服务
builder.Services
    .AddCoreServices()
    .AddDataServices(builder.Configuration)
    .AddDataProtection()
    .AddSecurityServices()
    .AddConfigOptions(builder.Configuration)
    .AddApplicationServices();

var app = builder.Build();

// 配置中间件管道
app.ConfigurePipeline();

// 示例 API 端点
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}