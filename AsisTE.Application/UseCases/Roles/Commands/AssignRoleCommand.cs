using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class AssignRoleCommand : IRequest
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
}

internal class AssignRoleCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AssignRoleCommand>
{
    public async Task Handle(
        AssignRoleCommand request,
        CancellationToken cancellationToken)
    {
        var user = await unitOfWork.Users.GetByIdAsync(request.UserId);

        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado");

        var role = await unitOfWork.Roles.GetByIdAsync(request.RoleId);

        if (role == null)
            throw new KeyNotFoundException("Rol no encontrado");

        var userRole = new UserRole
        {
            UserId = request.UserId,
            RoleId = request.RoleId,
            AssignedAt = DateTime.Now
        };

        await unitOfWork.Roles.AssignRoleAsync(userRole);

        await unitOfWork.SaveChangesAsync();
    }
}