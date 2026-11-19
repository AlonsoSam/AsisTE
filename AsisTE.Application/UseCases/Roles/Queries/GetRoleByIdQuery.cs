using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Queries;

public class GetRoleByIdQuery : IRequest<Role>
{
    public Guid Id { get; set; }
}

internal class GetRoleByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetRoleByIdQuery, Role>
{
    public async Task<Role> Handle(
        GetRoleByIdQuery request,
        CancellationToken cancellationToken)
    {
        var role = await unitOfWork.Roles.GetByIdAsync(request.Id);

        if (role == null)
            throw new KeyNotFoundException("Rol no encontrado");

        return role;
    }
}