using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Commands;

public class DeleteRoleCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteRoleCommandHandler(
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteRoleCommand>
{
    public async Task Handle(
        DeleteRoleCommand request,
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

        await unitOfWork.Roles.DeleteAsync(role);

        await unitOfWork.SaveChangesAsync();
    }
}