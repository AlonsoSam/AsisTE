using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class ResetNotificationCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class ResetNotificationCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<ResetNotificationCommand, bool>
{
    public async Task<bool> Handle(
        ResetNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification =
            await unitOfWork.Notifications.GetByIdAsync(request.Id);

        if (notification == null)
            throw new KeyNotFoundException("Notificación no encontrada");

        notification.Status = "pendiente";
        notification.SentAt = null;

        await unitOfWork.Notifications.UpdateAsync(notification);

        return true;
    }
}