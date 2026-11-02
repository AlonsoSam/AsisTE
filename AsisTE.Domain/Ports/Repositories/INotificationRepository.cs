using AsisTE.Domain.Entities;

namespace AsisTE.Domain.Ports.Repositories;

public interface INotificationRepository
{
    Task<List<Notification>> GetAllAsync();
    Task<Notification?> GetByIdAsync(Guid id);
    Task<List<Notification>> GetByGuardianIdAsync(Guid guardianId);
    Task AddAsync(Notification notification);
    Task UpdateAsync(Notification notification);
}