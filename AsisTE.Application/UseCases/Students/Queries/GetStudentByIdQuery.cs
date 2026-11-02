using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Queries;

public class GetStudentByIdQuery : IRequest<Student?>
{
    public Guid Id { get; set; }
}

internal class GetStudentByIdQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentByIdQuery, Student?>
{
    public async Task<Student?> Handle(
        GetStudentByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await studentRepository.GetByIdAsync(request.Id);
    }
}