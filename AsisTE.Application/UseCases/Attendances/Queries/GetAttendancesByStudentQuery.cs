using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesByStudentQuery : IRequest<List<Attendance>>
{
    public Guid StudentId { get; set; }
}

internal class GetAttendancesByStudentQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAttendancesByStudentQuery, List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesByStudentQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Attendances
            .GetByStudentIdAsync(request.StudentId);
    }
}