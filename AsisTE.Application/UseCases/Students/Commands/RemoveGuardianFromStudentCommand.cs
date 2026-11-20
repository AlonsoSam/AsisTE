using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class RemoveGuardianFromStudentCommand : IRequest
{
    public Guid StudentId { get; set; }

    public Guid GuardianId { get; set; }
}

internal class RemoveGuardianFromStudentCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<RemoveGuardianFromStudentCommand>
{
    public async Task Handle(
        RemoveGuardianFromStudentCommand request,
        CancellationToken cancellationToken)
    {
        var student =
            await unitOfWork.Students.GetByIdAsync(request.StudentId);

        if (student == null)
            throw new KeyNotFoundException("Estudiante no encontrado");

        var guardian =
            await unitOfWork.Guardians.GetByIdAsync(request.GuardianId);

        if (guardian == null)
            throw new KeyNotFoundException("Apoderado no encontrado");

        var relation =
            await unitOfWork.StudentGuardians.GetAsync(
                request.StudentId,
                request.GuardianId
            );

        if (relation == null)
            throw new KeyNotFoundException(
                "El apoderado no está asignado a este estudiante"
            );

        await unitOfWork.StudentGuardians.DeleteAsync(relation);

        await unitOfWork.SaveChangesAsync();
    }
}