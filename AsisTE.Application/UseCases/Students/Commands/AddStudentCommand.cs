using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
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

internal class AddStudentCommandHandler(IStudentRepository studentRepository)
    : IRequestHandler<AddStudentCommand, Guid>
{
    public async Task<Guid> Handle(
        AddStudentCommand request,
        CancellationToken cancellationToken)
    {
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

        await studentRepository.AddAsync(student);

        return student.StudentId;
    }
}