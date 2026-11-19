using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class MarkNotificationAsSentCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class MarkNotificationAsSentCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<MarkNotificationAsSentCommand, bool>
{
    public async Task<bool> Handle(
        MarkNotificationAsSentCommand request,
        CancellationToken cancellationToken)
    {
        var notification =
            await unitOfWork.Notifications.GetByIdAsync(request.Id);

        if (notification == null)
            throw new KeyNotFoundException("Notificación no encontrada");

        notification.Status = "enviado";
        notification.SentAt = DateTime.Now;

        await unitOfWork.Notifications.UpdateAsync(notification);

        return true;
    }
}