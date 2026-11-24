using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class DeleteRoleCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteRoleCommandHandler(
    IRoleRepository roleRepository)
    : IRequestHandler<DeleteRoleCommand>
{
    public async Task Handle(
        DeleteRoleCommand request,
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

        await roleRepository.DeleteAsync(role);
    }
}