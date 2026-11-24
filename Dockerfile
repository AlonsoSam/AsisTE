# etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# copiamos primero los proyectos para aprovechar la cache de restore
COPY AsisTE.Domain/AsisTE.Domain.csproj AsisTE.Domain/
COPY AsisTE.Application/AsisTE.Application.csproj AsisTE.Application/
COPY AsisTE.Infrastructure/AsisTE.Infrastructure.csproj AsisTE.Infrastructure/
COPY AsisTE.Persistence/AsisTE.Persistence.csproj AsisTE.Persistence/

RUN dotnet restore AsisTE.Persistence/AsisTE.Persistence.csproj

# copiamos el resto del proyecto
COPY . .

RUN dotnet publish \
    AsisTE.Persistence/AsisTE.Persistence.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "AsisTE.Persistence.dll"]