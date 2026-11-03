using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class AssignRoleCommand : IRequest<bool>
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
}

internal class AssignRoleCommandHandler(
    IRoleRepository roleRepository)
    : IRequestHandler<AssignRoleCommand, bool>
{
    public async Task<bool> Handle(
        AssignRoleCommand request,
        CancellationToken cancellationToken)
    {
        var role = await roleRepository.GetByIdAsync(request.RoleId);

        if (role == null)
            return false;

        var userRole = new UserRole
        {
            UserId = request.UserId,
            RoleId = request.RoleId
        };

        await roleRepository.AssignRoleAsync(userRole);

        return true;
    }
}