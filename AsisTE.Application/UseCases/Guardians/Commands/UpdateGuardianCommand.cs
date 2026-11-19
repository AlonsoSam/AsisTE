using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Commands;

public class UpdateGuardianCommand : IRequest
{
    public Guid Id { get; set; }
    public string? Dni { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

internal class UpdateGuardianCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateGuardianCommand>
{
    public async Task Handle(
        UpdateGuardianCommand request,
        CancellationToken cancellationToken)
    {
        var guardian = await unitOfWork.Guardians.GetByIdAsync(request.Id);

        if (guardian == null)
            throw new KeyNotFoundException("Apoderado no encontrado");

        guardian.Dni = request.Dni;
        guardian.FirstName = request.FirstName;
        guardian.LastName = request.LastName;
        guardian.Phone = request.Phone;
        guardian.Email = request.Email;

        await unitOfWork.Guardians.UpdateAsync(guardian);
    }
}