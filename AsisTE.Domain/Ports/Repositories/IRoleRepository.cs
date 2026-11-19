using AsisTE.Domain.Entities;

namespace AsisTE.Domain.Ports.Repositories;

public interface IRoleRepository
{
    Task<List<Role>> GetAllAsync();
    Task<Role?> GetByIdAsync(Guid id);
    Task<Role?> GetByNameAsync(string roleName);
    Task<bool> UserHasRoleAsync(Guid userId, Guid roleId);
    Task AddAsync(Role role);
    Task AssignRoleAsync(UserRole userRole);
}