using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Queries;

public class GetRoleByIdQuery : IRequest<Role?>
{
    public Guid Id { get; set; }
}

internal class GetRoleByIdQueryHandler(
    IRoleRepository roleRepository)
    : IRequestHandler<GetRoleByIdQuery, Role?>
{
    public async Task<Role?> Handle(
        GetRoleByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await roleRepository.GetByIdAsync(request.Id);
    }
}