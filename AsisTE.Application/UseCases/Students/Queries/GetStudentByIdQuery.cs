using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Queries;

public class GetStudentByIdQuery : IRequest<Student>
{
    public Guid Id { get; set; }
}

internal class GetStudentByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetStudentByIdQuery, Student>
{
    public async Task<Student> Handle(
        GetStudentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var student = await unitOfWork.Students.GetByIdAsync(request.Id);

        if (student == null)
            throw new KeyNotFoundException("Estudiante no encontrado");

        return student;
    }
}