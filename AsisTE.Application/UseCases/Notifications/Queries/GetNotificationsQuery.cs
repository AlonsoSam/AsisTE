using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationsQuery : IRequest<List<Notification>>
{
}

internal class GetNotificationsQueryHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<GetNotificationsQuery, List<Notification>>
{
    public async Task<List<Notification>> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        return await notificationRepository.GetAllAsync();
    }
}