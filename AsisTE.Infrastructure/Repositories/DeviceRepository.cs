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
    }

    public Task UpdateAsync(Device device)
    {
        context.Devices.Update(device);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Device device)
    {
        context.Devices.Remove(device);

        return Task.CompletedTask;
    }
        
    public async Task<Device?> GetByCodeAsync(string deviceCode)
    {
        return await context.Devices
            .FirstOrDefaultAsync(x => x.DeviceCode == deviceCode);
    }
}