using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationByIdQuery : IRequest<Notification>
{
    public Guid Id { get; set; }
}

internal class GetNotificationByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetNotificationByIdQuery, Notification>
{
    public async Task<Notification> Handle(
        GetNotificationByIdQuery request,
        CancellationToken cancellationToken)
    {
        var notification =
            await unitOfWork.Notifications.GetByIdAsync(request.Id);

        if (notification == null)
            throw new KeyNotFoundException("Notificación no encontrada");

        return notification;
    }
}