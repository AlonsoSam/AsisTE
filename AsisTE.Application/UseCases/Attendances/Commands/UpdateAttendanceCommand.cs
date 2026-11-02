using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Commands;

public class UpdateAttendanceCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public DateTime? EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
    public string Status { get; set; } = null!;
}

internal class UpdateAttendanceCommandHandler(IAttendanceRepository attendanceRepository)
    : IRequestHandler<UpdateAttendanceCommand, bool>
{
    public async Task<bool> Handle(
        UpdateAttendanceCommand request,
        CancellationToken cancellationToken)
    {
        var attendance = await attendanceRepository.GetByIdAsync(request.Id);

        if (attendance == null)
            return false;

        attendance.EntryTime = request.EntryTime;
        attendance.ExitTime = request.ExitTime;
        attendance.Status = request.Status;

        await attendanceRepository.UpdateAsync(attendance);

        return true;
    }
}