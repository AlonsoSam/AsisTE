using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class RoleRepository(AsisteContext context) : IRoleRepository
{
    public async Task<List<Role>> GetAllAsync()
    {
        return await context.Roles
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Role?> GetByIdAsync(Guid id)
    {
        return await context.Roles
            .FirstOrDefaultAsync(x => x.RoleId == id);
    }

    public async Task AddAsync(Role role)
    {
        await context.Roles.AddAsync(role);
        await context.SaveChangesAsync();
    }

    public async Task AssignRoleAsync(UserRole userRole)
    {
        await context.UserRoles.AddAsync(userRole);
        await context.SaveChangesAsync();
    }
}