using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
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

internal class AddAttendanceCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddAttendanceCommand, Guid>
{
    public async Task<Guid> Handle(
        AddAttendanceCommand request,
        CancellationToken cancellationToken)
    {
        var student =
            await unitOfWork.Students.GetByIdAsync(request.StudentId);

        if (student == null)
            throw new KeyNotFoundException("Estudiante no encontrado");

        if (request.DeviceId.HasValue)
        {
            var device =
                await unitOfWork.Devices.GetByIdAsync(
                    request.DeviceId.Value
                );

            if (device == null)
                throw new KeyNotFoundException(
                    "Dispositivo no encontrado"
                );
        }

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

        await unitOfWork.Attendances.AddAsync(attendance);

        await unitOfWork.SaveChangesAsync();

        return attendance.AttendanceId;
    }
}