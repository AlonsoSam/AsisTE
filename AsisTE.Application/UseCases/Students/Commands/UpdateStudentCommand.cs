using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class UpdateStudentCommand : IRequest
{
    public Guid Id { get; set; }
    public string? Dni { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Grade { get; set; }
    public string? Section { get; set; }
    public bool Active { get; set; }
}

internal class UpdateStudentCommandHandler(
    IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateStudentCommand>
{
    public async Task Handle(
        UpdateStudentCommand request,
        CancellationToken cancellationToken)
    {
        var student =
            await unitOfWork.Students.GetByIdAsync(
                request.Id
            );

        if (student == null)
        {
            throw new KeyNotFoundException(
                "Estudiante no encontrado"
            );
        }

        if (!string.IsNullOrWhiteSpace(request.Dni))
        {
            var existingStudent =
                await unitOfWork.Students.GetByDniAsync(
                    request.Dni
                );

            if (
                existingStudent != null &&
                existingStudent.StudentId != request.Id
            )
            {
                throw new InvalidOperationException(
                    "El DNI del estudiante ya está registrado"
                );
            }
        }

        student.Dni = request.Dni;
        student.FirstName = request.FirstName;
        student.LastName = request.LastName;
        student.Grade = request.Grade;
        student.Section = request.Section;
        student.Active = request.Active;

        await unitOfWork.Students.UpdateAsync(
            student
        );

        await unitOfWork.SaveChangesAsync();
    }
}