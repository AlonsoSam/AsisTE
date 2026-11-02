using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class DeviceRepository(AsisteContext context) : IDeviceRepository
{
    public async Task<List<Device>> GetAllAsync()
    {
        return await context.Devices
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Device?> GetByIdAsync(Guid id)
    {
        return await context.Devices
            .FirstOrDefaultAsync(x => x.DeviceId == id);
    }

    public async Task AddAsync(Device device)
    {
        await context.Devices.AddAsync(device);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Device device)
    {
        context.Devices.Update(device);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Device device)
    {
        context.Devices.Remove(device);
        await context.SaveChangesAsync();
    }
}