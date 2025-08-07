using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var webapi = builder.AddProject<AIDoor_WebAPI>("api");

builder.AddNpmApp("app", "../../app")
    .WithHttpEndpoint(env: "port", targetPort: 8000)
    .PublishAsDockerFile();

builder.AddNpmApp("admin", "../../admin")
    .WithHttpEndpoint(env: "port")
    .PublishAsDockerFile();

builder.Build().Run();