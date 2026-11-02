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
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Guardian guardian)
    {
        context.Guardians.Update(guardian);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guardian guardian)
    {
        context.Guardians.Remove(guardian);
        await context.SaveChangesAsync();
    }
}