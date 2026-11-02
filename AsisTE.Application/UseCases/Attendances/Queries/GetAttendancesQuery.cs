using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesQuery : IRequest<List<Attendance>>
{
}

internal class GetAttendancesQueryHandler(IAttendanceRepository attendanceRepository)
    : IRequestHandler<GetAttendancesQuery, List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesQuery request,
        CancellationToken cancellationToken)
    {
        return await attendanceRepository.GetAllAsync();
    }
}