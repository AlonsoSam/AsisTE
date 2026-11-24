using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class UpdateRoleCommand : IRequest
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;
}

internal class UpdateRoleCommandHandler(
    IRoleRepository roleRepository)
    : IRequestHandler<UpdateRoleCommand>
{
    public async Task Handle(
        UpdateRoleCommand request,
        CancellationToken cancellationToken)
    {
        var role = await roleRepository.GetByIdAsync(
            request.Id
        );

        if (role is null)
        {
            throw new Exception(
                "No se encontró el rol"
            );
        }

        role.RoleName = request.Name;

        await roleRepository.UpdateAsync(role);
    }
}