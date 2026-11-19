using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Queries;

public class GetGuardiansQuery : IRequest<List<Guardian>>
{
}

internal class GetGuardiansQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetGuardiansQuery, List<Guardian>>
{
    public async Task<List<Guardian>> Handle(
        GetGuardiansQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Guardians.GetAllAsync();
    }
}