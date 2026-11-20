using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class AddStudentCommand : IRequest<Guid>
{
    public string? Dni { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Grade { get; set; }
    public string? Section { get; set; }
}

internal class AddStudentCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddStudentCommand, Guid>
{
    public async Task<Guid> Handle(
        AddStudentCommand request,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Dni))
        {
            var existingStudent =
                await unitOfWork.Students.GetByDniAsync(request.Dni);

            if (existingStudent != null)
                throw new InvalidOperationException(
                    "El DNI del estudiante ya está registrado"
                );
        }

        var student = new Student
        {
            StudentId = Guid.NewGuid(),
            Dni = request.Dni,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Grade = request.Grade,
            Section = request.Section,
            Active = true,
            CreatedAt = DateTime.Now
        };

        await unitOfWork.Students.AddAsync(student);

        await unitOfWork.SaveChangesAsync();

        return student.StudentId;
    }
}