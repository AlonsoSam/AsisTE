using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class UpdateStudentCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string? Dni { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Grade { get; set; }
    public string? Section { get; set; }
    public bool Active { get; set; }
}

internal class UpdateStudentCommandHandler(IStudentRepository studentRepository)
    : IRequestHandler<UpdateStudentCommand, bool>
{
    public async Task<bool> Handle(
        UpdateStudentCommand request,
        CancellationToken cancellationToken)
    {
        var student = await studentRepository.GetByIdAsync(request.Id);

        if (student == null)
            return false;

        student.Dni = request.Dni;
        student.FirstName = request.FirstName;
        student.LastName = request.LastName;
        student.Grade = request.Grade;
        student.Section = request.Section;
        student.Active = request.Active;

        await studentRepository.UpdateAsync(student);

        return true;
    }
}