using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Queries;

public class GetGuardianByIdQuery : IRequest<Guardian?>
{
    public Guid Id { get; set; }
}

internal class GetGuardianByIdQueryHandler(IGuardianRepository guardianRepository)
    : IRequestHandler<GetGuardianByIdQuery, Guardian?>
{
    public async Task<Guardian?> Handle(
        GetGuardianByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await guardianRepository.GetByIdAsync(request.Id);
    }
}