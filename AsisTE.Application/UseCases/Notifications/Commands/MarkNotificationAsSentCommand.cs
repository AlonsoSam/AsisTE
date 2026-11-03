using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class MarkNotificationAsSentCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class MarkNotificationAsSentCommandHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<MarkNotificationAsSentCommand, bool>
{
    public async Task<bool> Handle(
        MarkNotificationAsSentCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await notificationRepository
            .GetByIdAsync(request.Id);

        if (notification == null)
            return false;

        notification.Status = "enviado";
        notification.SentAt = DateTime.Now;

        await notificationRepository.UpdateAsync(notification);

        return true;
    }
}