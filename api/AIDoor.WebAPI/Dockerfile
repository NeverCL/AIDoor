FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 复制项目文件并还原依赖
COPY ["AIDoor.WebAPI/AIDoor.WebAPI.csproj", "AIDoor.WebAPI/"]
RUN dotnet restore "AIDoor.WebAPI/AIDoor.WebAPI.csproj"

# 复制所有文件并构建
COPY . .
WORKDIR "/src/AIDoor.WebAPI"
RUN dotnet build "AIDoor.WebAPI.csproj" -c Release -o /app/build

# 发布
FROM build AS publish
RUN dotnet publish "AIDoor.WebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 最终镜像
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# 创建上传目录
RUN mkdir -p App_Data/uploads && chmod -R 777 App_Data

# 环境变量
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "AIDoor.WebAPI.dll"] 