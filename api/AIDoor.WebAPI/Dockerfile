FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["AIDoor.WebAPI/AIDoor.WebAPI.csproj", "AIDoor.WebAPI/"]
COPY ["AIDoor.ServiceDefaults/AIDoor.ServiceDefaults.csproj", "AIDoor.ServiceDefaults/"]
RUN dotnet restore "AIDoor.WebAPI/AIDoor.WebAPI.csproj"
COPY . .
WORKDIR "/src/AIDoor.WebAPI"
RUN dotnet build "./AIDoor.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AIDoor.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AIDoor.WebAPI.dll"]
