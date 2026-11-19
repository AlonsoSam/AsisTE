using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class NotificationRepository(AsisteContext context) : INotificationRepository
{
    public async Task<List<Notification>> GetAllAsync()
    {
        return await context.Notifications
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(Guid id)
    {
        return await context.Notifications
            .FirstOrDefaultAsync(x => x.NotificationId == id);
    }

    public async Task<List<Notification>> GetByGuardianIdAsync(Guid guardianId)
    {
        return await context.Notifications
            .AsNoTracking()
            .Where(x => x.GuardianId == guardianId)
            .ToListAsync();
    }

    public async Task<List<Notification>> GetByStatusAsync(string status)
    {
        return await context.Notifications
            .AsNoTracking()
            .Where(x => x.Status != null &&
                        x.Status.ToLower() == status.ToLower())
            .ToListAsync();
    }

    public async Task AddAsync(Notification notification)
    {
        await context.Notifications.AddAsync(notification);
    }

    public Task UpdateAsync(Notification notification)
    {
        context.Notifications.Update(notification);

        return Task.CompletedTask;
    }
}