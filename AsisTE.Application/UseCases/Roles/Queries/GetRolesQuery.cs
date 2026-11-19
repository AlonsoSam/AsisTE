using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Roles.Queries;

public class GetRolesQuery : IRequest<List<Role>>
{
}

internal class GetRolesQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetRolesQuery, List<Role>>
{
    public async Task<List<Role>> Handle(
        GetRolesQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Roles.GetAllAsync();
    }
}