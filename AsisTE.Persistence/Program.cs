using AsisTE.Application;
using AsisTE.Infrastructure.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// de aca cargamos el context y los repositorios de Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

// con esto MediatR encuentra los handlers que vayamos creando en Application
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(AssemblyReference).Assembly
    )
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();