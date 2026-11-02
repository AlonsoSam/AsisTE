using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class AddNotificationCommand : IRequest<Guid>
{
    public Guid? AttendanceId { get; set; }
    public Guid GuardianId { get; set; }
    public string Message { get; set; } = null!;
}

internal class AddNotificationCommandHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<AddNotificationCommand, Guid>
{
    public async Task<Guid> Handle(
        AddNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification = new Notification
        {
            NotificationId = Guid.NewGuid(),
            AttendanceId = request.AttendanceId,
            GuardianId = request.GuardianId,
            Message = request.Message,
            Status = "pendiente",
            CreatedAt = DateTime.Now
        };

        await notificationRepository.AddAsync(notification);

        return notification.NotificationId;
    }
}