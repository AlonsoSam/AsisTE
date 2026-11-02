using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Queries;

public class GetStudentsQuery : IRequest<List<Student>>
{
}

internal class GetStudentsQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentsQuery, List<Student>>
{
    public async Task<List<Student>> Handle(
        GetStudentsQuery request,
        CancellationToken cancellationToken)
    {
        return await studentRepository.GetAllAsync();
    }
}