using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class AddRoleCommand : IRequest<Guid>
{
    public string RoleName { get; set; } = null!;
}

internal class AddRoleCommandHandler(
    IRoleRepository roleRepository)
    : IRequestHandler<AddRoleCommand, Guid>
{
    public async Task<Guid> Handle(
        AddRoleCommand request,
        CancellationToken cancellationToken)
    {
        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            RoleName = request.RoleName
        };

        await roleRepository.AddAsync(role);

        return role.RoleId;
    }
}