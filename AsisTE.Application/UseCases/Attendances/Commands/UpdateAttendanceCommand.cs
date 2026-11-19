using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Commands;

public class UpdateAttendanceCommand : IRequest
{
    public Guid Id { get; set; }
    public DateTime? EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
    public string Status { get; set; } = null!;
}

internal class UpdateAttendanceCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateAttendanceCommand>
{
    public async Task Handle(
        UpdateAttendanceCommand request,
        CancellationToken cancellationToken)
    {
        var attendance = await unitOfWork.Attendances.GetByIdAsync(request.Id);

        if (attendance == null)
            throw new KeyNotFoundException("Asistencia no encontrada");

        attendance.EntryTime = request.EntryTime;
        attendance.ExitTime = request.ExitTime;
        attendance.Status = request.Status;

        await unitOfWork.Attendances.UpdateAsync(attendance);
    }
}