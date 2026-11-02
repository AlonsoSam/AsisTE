using AsisTE.Domain.Entities;

namespace AsisTE.Domain.Ports.Repositories;

public interface IDeviceRepository
{
    Task<List<Device>> GetAllAsync();
    Task<Device?> GetByIdAsync(Guid id);
    Task AddAsync(Device device);
    Task UpdateAsync(Device device);
    Task DeleteAsync(Device device);
}