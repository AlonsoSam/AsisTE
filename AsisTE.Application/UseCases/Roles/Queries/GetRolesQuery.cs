using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Queries;

public class GetRolesQuery : IRequest<List<Role>>
{
}

internal class GetRolesQueryHandler(
    IRoleRepository roleRepository)
    : IRequestHandler<GetRolesQuery, List<Role>>
{
    public async Task<List<Role>> Handle(
        GetRolesQuery request,
        CancellationToken cancellationToken)
    {
        return await roleRepository.GetAllAsync();
    }
}