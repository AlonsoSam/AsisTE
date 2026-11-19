using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class UpdateNotificationStatusCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Status { get; set; } = null!;
}

internal class UpdateNotificationStatusCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateNotificationStatusCommand, bool>
{
    public async Task<bool> Handle(
        UpdateNotificationStatusCommand request,
        CancellationToken cancellationToken)
    {
        var notification =
            await unitOfWork.Notifications.GetByIdAsync(request.Id);

        if (notification == null)
            throw new KeyNotFoundException("Notificación no encontrada");

        notification.Status = request.Status;

        if (request.Status == "enviado")
            notification.SentAt = DateTime.Now;

        await unitOfWork.Notifications.UpdateAsync(notification);

        return true;
    }
}