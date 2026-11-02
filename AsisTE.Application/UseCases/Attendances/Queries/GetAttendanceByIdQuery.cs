using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendanceByIdQuery : IRequest<Attendance?>
{
    public Guid Id { get; set; }
}

internal class GetAttendanceByIdQueryHandler(IAttendanceRepository attendanceRepository)
    : IRequestHandler<GetAttendanceByIdQuery, Attendance?>
{
    public async Task<Attendance?> Handle(
        GetAttendanceByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await attendanceRepository.GetByIdAsync(request.Id);
    }
}