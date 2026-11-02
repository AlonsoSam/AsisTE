using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Commands;

public class DeleteGuardianCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class DeleteGuardianCommandHandler(IGuardianRepository guardianRepository)
    : IRequestHandler<DeleteGuardianCommand, bool>
{
    public async Task<bool> Handle(
        DeleteGuardianCommand request,
        CancellationToken cancellationToken)
    {
        var guardian = await guardianRepository.GetByIdAsync(request.Id);

        if (guardian == null)
            return false;

        await guardianRepository.DeleteAsync(guardian);

        return true;
    }
}