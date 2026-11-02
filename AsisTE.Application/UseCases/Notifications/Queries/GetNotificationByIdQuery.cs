using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationByIdQuery : IRequest<Notification?>
{
    public Guid Id { get; set; }
}

internal class GetNotificationByIdQueryHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<GetNotificationByIdQuery, Notification?>
{
    public async Task<Notification?> Handle(
        GetNotificationByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await notificationRepository.GetByIdAsync(request.Id);
    }
}