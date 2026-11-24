using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Commands;

public class DeleteNotificationCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteNotificationCommandHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<DeleteNotificationCommand>
{
    public async Task Handle(
        DeleteNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification =
            await notificationRepository.GetByIdAsync(
                request.Id
            );

        if (notification is null)
        {
            throw new Exception(
                "No se encontró la notificación"
            );
        }

        await notificationRepository.DeleteAsync(
            notification
        );
    }
}