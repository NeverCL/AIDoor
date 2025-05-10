using AIDoor.WebAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

// 注册服务
builder.Services
    .AddCoreServices()
    .AddDataServices(builder.Configuration)
    .AddSecret()
    .AddSecurityServices()
    .AddConfigOptions(builder.Configuration)
    .AddApplicationServices();

var app = builder.Build();

// 配置中间件管道
app.ConfigurePipeline();

// 初始化数据库
app.SeedDatabase();


app.Run();