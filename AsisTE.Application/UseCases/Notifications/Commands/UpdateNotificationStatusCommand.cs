using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class UpdateNotificationStatusCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Status { get; set; } = null!;
}

internal class UpdateNotificationStatusCommandHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<UpdateNotificationStatusCommand, bool>
{
    public async Task<bool> Handle(
        UpdateNotificationStatusCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await notificationRepository
            .GetByIdAsync(request.Id);

        if (notification == null)
            return false;

        notification.Status = request.Status;

        if (request.Status == "enviado")
            notification.SentAt = DateTime.Now;

        await notificationRepository.UpdateAsync(notification);

        return true;
    }
}