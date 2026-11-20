using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using AsisTE.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AsisTE.Domain.Ports.UnitOfWork;
using AsisTE.Infrastructure.Adapters.UnitOfWork;

namespace AsisTE.Infrastructure.Configuration;

public static class InfrastructureServicesExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AsisteContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection")
            )
        );

        // si agregas otro repositorio registralo aca tambien
        // asi todos seguimos usando la misma configuracion
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IStudentGuardianRepository, StudentGuardianRepository>();
        services.AddScoped<IGuardianRepository, GuardianRepository>();
        services.AddScoped<IDeviceRepository, DeviceRepository>();
        services.AddScoped<IAttendanceRepository, AttendanceRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}