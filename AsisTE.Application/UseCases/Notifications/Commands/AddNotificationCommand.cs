using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class AddNotificationCommand : IRequest<Guid>
{
    public Guid? AttendanceId { get; set; }
    public Guid GuardianId { get; set; }
    public string Message { get; set; } = null!;
}

internal class AddNotificationCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddNotificationCommand, Guid>
{
    public async Task<Guid> Handle(
        AddNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var guardian =
            await unitOfWork.Guardians.GetByIdAsync(request.GuardianId);

        if (guardian == null)
            throw new KeyNotFoundException(
                "Apoderado no encontrado"
            );

        if (request.AttendanceId.HasValue)
        {
            var attendance =
                await unitOfWork.Attendances.GetByIdAsync(
                    request.AttendanceId.Value
                );

            if (attendance == null)
                throw new KeyNotFoundException(
                    "Asistencia no encontrada"
                );
        }

        var notification = new Notification
        {
            NotificationId = Guid.NewGuid(),
            AttendanceId = request.AttendanceId,
            GuardianId = request.GuardianId,
            Message = request.Message,
            Status = "pendiente",
            CreatedAt = DateTime.Now
        };

        await unitOfWork.Notifications.AddAsync(notification);

        await unitOfWork.SaveChangesAsync();

        return notification.NotificationId;
    }
}