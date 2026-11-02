using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesByStudentQuery : IRequest<List<Attendance>>
{
    public Guid StudentId { get; set; }
}

internal class GetAttendancesByStudentQueryHandler(IAttendanceRepository attendanceRepository)
    : IRequestHandler<GetAttendancesByStudentQuery, List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesByStudentQuery request,
        CancellationToken cancellationToken)
    {
        return await attendanceRepository.GetByStudentIdAsync(request.StudentId);
    }
}