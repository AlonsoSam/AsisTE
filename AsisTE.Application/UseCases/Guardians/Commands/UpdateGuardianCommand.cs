using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Commands;

public class UpdateGuardianCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string? Dni { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

internal class UpdateGuardianCommandHandler(IGuardianRepository guardianRepository)
    : IRequestHandler<UpdateGuardianCommand, bool>
{
    public async Task<bool> Handle(
        UpdateGuardianCommand request,
        CancellationToken cancellationToken)
    {
        var guardian = await guardianRepository.GetByIdAsync(request.Id);

        if (guardian == null)
            return false;

        guardian.Dni = request.Dni;
        guardian.FirstName = request.FirstName;
        guardian.LastName = request.LastName;
        guardian.Phone = request.Phone;
        guardian.Email = request.Email;

        await guardianRepository.UpdateAsync(guardian);

        return true;
    }
}