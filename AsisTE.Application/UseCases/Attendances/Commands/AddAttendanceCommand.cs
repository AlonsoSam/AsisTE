using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Commands;

public class AddAttendanceCommand : IRequest<Guid>
{
    public Guid StudentId { get; set; }
    public Guid? DeviceId { get; set; }
    public DateOnly AttendanceDate { get; set; }
    public DateTime? EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
    public string Status { get; set; } = null!;
}

internal class AddAttendanceCommandHandler(IAttendanceRepository attendanceRepository)
    : IRequestHandler<AddAttendanceCommand, Guid>
{
    public async Task<Guid> Handle(
        AddAttendanceCommand request,
        CancellationToken cancellationToken)
    {
        var attendance = new Attendance
        {
            AttendanceId = Guid.NewGuid(),
            StudentId = request.StudentId,
            DeviceId = request.DeviceId,
            AttendanceDate = request.AttendanceDate,
            EntryTime = request.EntryTime,
            ExitTime = request.ExitTime,
            Status = request.Status,
            CreatedAt = DateTime.Now
        };

        await attendanceRepository.AddAsync(attendance);

        return attendance.AttendanceId;
    }
}