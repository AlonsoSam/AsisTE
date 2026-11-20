using AsisTE.Domain.Ports.Repositories;

namespace AsisTE.Domain.Ports.UnitOfWork;

public interface IUnitOfWork
{
    IStudentRepository Students { get; }

    IGuardianRepository Guardians { get; }

    IStudentGuardianRepository StudentGuardians { get; }

    IDeviceRepository Devices { get; }

    IAttendanceRepository Attendances { get; }

    INotificationRepository Notifications { get; }

    IUserRepository Users { get; }

    IRoleRepository Roles { get; }

    Task<int> SaveChangesAsync();
}