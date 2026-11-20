using AsisTE.Domain.Ports.Repositories;
using AsisTE.Domain.Ports.UnitOfWork;
using AsisTE.Infrastructure.Context;

namespace AsisTE.Infrastructure.Adapters.UnitOfWork;

public class UnitOfWork(
    AsisteContext context,
    IStudentRepository studentRepository,
    IGuardianRepository guardianRepository,
    IStudentGuardianRepository studentGuardianRepository,
    IDeviceRepository deviceRepository,
    IAttendanceRepository attendanceRepository,
    INotificationRepository notificationRepository,
    IUserRepository userRepository,
    IRoleRepository roleRepository)
    : IUnitOfWork
{
    public IStudentRepository Students { get; } = studentRepository;

    public IGuardianRepository Guardians { get; } = guardianRepository;

    public IStudentGuardianRepository StudentGuardians { get; } = studentGuardianRepository;

    public IDeviceRepository Devices { get; } = deviceRepository;

    public IAttendanceRepository Attendances { get; }
        = attendanceRepository;

    public INotificationRepository Notifications { get; }
        = notificationRepository;

    public IUserRepository Users { get; } = userRepository;

    public IRoleRepository Roles { get; } = roleRepository;

    public async Task<int> SaveChangesAsync()
    {
        return await context.SaveChangesAsync();
    }
}