using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class GuardianRepository(AsisteContext context) : IGuardianRepository
{
    public async Task<List<Guardian>> GetAllAsync()
    {
        return await context.Guardians
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Guardian?> GetByIdAsync(Guid id)
    {
        return await context.Guardians
            .FirstOrDefaultAsync(x => x.GuardianId == id);
    }

    public async Task AddAsync(Guardian guardian)
    {
        await context.Guardians.AddAsync(guardian);
    }

    public Task UpdateAsync(Guardian guardian)
    {
        context.Guardians.Update(guardian);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guardian guardian)
    {
        context.Guardians.Remove(guardian);

        return Task.CompletedTask;
    }
    
    public async Task<Guardian?> GetByDniAsync(string dni)
    {
        return await context.Guardians
            .FirstOrDefaultAsync(x => x.Dni == dni);
    }
    
}