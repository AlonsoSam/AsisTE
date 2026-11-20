using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class AssignGuardianToStudentCommand : IRequest
{
    public Guid StudentId { get; set; }
    public Guid GuardianId { get; set; }
    public string? Relationship { get; set; }
}

internal class AssignGuardianToStudentCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AssignGuardianToStudentCommand>
{
    public async Task Handle(
        AssignGuardianToStudentCommand request,
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

        var existingRelation =
            await unitOfWork.StudentGuardians.GetAsync(
                request.StudentId,
                request.GuardianId
            );

        if (existingRelation != null)
            throw new InvalidOperationException(
                "El apoderado ya está asignado a este estudiante"
            );

        var studentGuardian = new StudentGuardian
        {
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            Relationship = request.Relationship
        };

        await unitOfWork.StudentGuardians.AddAsync(studentGuardian);

        await unitOfWork.SaveChangesAsync();
    }
}