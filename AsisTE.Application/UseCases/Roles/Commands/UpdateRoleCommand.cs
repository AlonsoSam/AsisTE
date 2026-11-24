using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class UpdateRoleCommand : IRequest
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;
}

internal class UpdateRoleCommandHandler(
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateRoleCommand>
{
    public async Task Handle(
        UpdateRoleCommand request,
        CancellationToken cancellationToken)
    {
        var role =
            await unitOfWork.Roles.GetByIdAsync(
                request.Id
            );

        if (role == null)
            throw new KeyNotFoundException(
                "Rol no encontrado"
            );

        var existingRole =
            await unitOfWork.Roles.GetByNameAsync(
                request.Name
            );

        if (
            existingRole != null &&
            existingRole.RoleId != request.Id
        )
        {
            throw new InvalidOperationException(
                "El nombre del rol ya está registrado"
            );
        }

        role.RoleName = request.Name;

        await unitOfWork.Roles.UpdateAsync(role);

        await unitOfWork.SaveChangesAsync();
    }
}