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

    public async Task AddAsync(Notification notification)
    {
        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Notification notification)
    {
        context.Notifications.Update(notification);
        await context.SaveChangesAsync();
    }
}