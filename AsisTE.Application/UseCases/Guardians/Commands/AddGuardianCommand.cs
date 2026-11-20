using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Guardians.Commands;

public class AddGuardianCommand : IRequest<Guid>
{
    public string? Dni { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

internal class AddGuardianCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddGuardianCommand, Guid>
{
    public async Task<Guid> Handle(
        AddGuardianCommand request,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Dni))
        {
            var existingGuardian =
                await unitOfWork.Guardians.GetByDniAsync(request.Dni);

            if (existingGuardian != null)
                throw new InvalidOperationException(
                    "El DNI del apoderado ya está registrado"
                );
        }

        var guardian = new Guardian
        {
            GuardianId = Guid.NewGuid(),
            Dni = request.Dni,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Email = request.Email,
            CreatedAt = DateTime.Now
        };

        await unitOfWork.Guardians.AddAsync(guardian);

        await unitOfWork.SaveChangesAsync();

        return guardian.GuardianId;
    }
}