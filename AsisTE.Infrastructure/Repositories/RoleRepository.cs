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

    public async Task<bool> UserHasRoleAsync(
        Guid userId,
        Guid roleId)
    {
        return await context.UserRoles
            .AsNoTracking()
            .AnyAsync(x =>
                x.UserId == userId &&
                x.RoleId == roleId
            );
    }

    public async Task AddAsync(Role role)
    {
        await context.Roles.AddAsync(role);
    }

    public async Task AssignRoleAsync(UserRole userRole)
    {
        await context.UserRoles.AddAsync(userRole);
    }

    public async Task<Role?> GetByNameAsync(string roleName)
    {
        return await context.Roles
            .FirstOrDefaultAsync(
                x => x.RoleName == roleName
            );
    }

    public async Task<List<Role>> GetByUserIdAsync(
        Guid userId)
    {
        return await context.UserRoles
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => x.Role)
            .ToListAsync();
    }

    public Task UpdateAsync(Role role)
    {
        context.Roles.Update(role);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Role role)
    {
        context.Roles.Remove(role);

        return Task.CompletedTask;
    }
}