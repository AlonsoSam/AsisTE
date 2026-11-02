using AsisTE.Domain.Entities;

namespace AsisTE.Domain.Ports.Repositories;

public interface IGuardianRepository
{
    Task<List<Guardian>> GetAllAsync();
    Task<Guardian?> GetByIdAsync(Guid id);
    Task AddAsync(Guardian guardian);
    Task UpdateAsync(Guardian guardian);
    Task DeleteAsync(Guardian guardian);
}