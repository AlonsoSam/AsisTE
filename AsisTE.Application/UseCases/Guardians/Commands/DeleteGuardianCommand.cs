using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Commands;

public class DeleteGuardianCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteGuardianCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteGuardianCommand>
{
    public async Task Handle(
        DeleteGuardianCommand request,
        CancellationToken cancellationToken)
    {
        var guardian = await unitOfWork.Guardians.GetByIdAsync(request.Id);

        if (guardian == null)
            throw new KeyNotFoundException("Apoderado no encontrado");

        await unitOfWork.Guardians.DeleteAsync(guardian);
    }
}