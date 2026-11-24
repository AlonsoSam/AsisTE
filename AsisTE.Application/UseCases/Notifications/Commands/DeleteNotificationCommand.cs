using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class DeleteNotificationCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteNotificationCommandHandler(
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteNotificationCommand>
{
    public async Task Handle(
        DeleteNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification =
            await unitOfWork.Notifications.GetByIdAsync(
                request.Id
            );

        if (notification == null)
            throw new KeyNotFoundException(
                "Notificación no encontrada"
            );

        await unitOfWork.Notifications.DeleteAsync(
            notification
        );

        await unitOfWork.SaveChangesAsync();
    }
}