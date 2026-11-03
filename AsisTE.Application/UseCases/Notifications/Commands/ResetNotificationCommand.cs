using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class ResetNotificationCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class ResetNotificationCommandHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<ResetNotificationCommand, bool>
{
    public async Task<bool> Handle(
        ResetNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await notificationRepository
            .GetByIdAsync(request.Id);

        if (notification == null)
            return false;

        notification.Status = "pendiente";
        notification.SentAt = null;

        await notificationRepository.UpdateAsync(notification);

        return true;
    }
}