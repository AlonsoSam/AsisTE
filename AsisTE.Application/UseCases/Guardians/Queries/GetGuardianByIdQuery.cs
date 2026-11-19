using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Queries;

public class GetGuardianByIdQuery : IRequest<Guardian>
{
    public Guid Id { get; set; }
}

internal class GetGuardianByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetGuardianByIdQuery, Guardian>
{
    public async Task<Guardian> Handle(
        GetGuardianByIdQuery request,
        CancellationToken cancellationToken)
    {
        var guardian = await unitOfWork.Guardians.GetByIdAsync(request.Id);

        if (guardian == null)
            throw new KeyNotFoundException("Apoderado no encontrado");

        return guardian;
    }
}