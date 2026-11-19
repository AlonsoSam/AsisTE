using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class AddRoleCommand : IRequest<Guid>
{
    public string RoleName { get; set; } = null!;
}

internal class AddRoleCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddRoleCommand, Guid>
{
    public async Task<Guid> Handle(
        AddRoleCommand request,
        CancellationToken cancellationToken)
    {
        var existingRole =
            await unitOfWork.Roles.GetByNameAsync(request.RoleName);

        if (existingRole != null)
            throw new InvalidOperationException(
                "El nombre del rol ya está registrado"
            );

        var role = new Role
        {
            RoleId = Guid.NewGuid(),
            RoleName = request.RoleName
        };

        await unitOfWork.Roles.AddAsync(role);

        await unitOfWork.SaveChangesAsync();

        return role.RoleId;
    }
}