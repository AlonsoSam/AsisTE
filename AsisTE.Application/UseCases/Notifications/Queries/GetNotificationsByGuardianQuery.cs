using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationsByGuardianQuery : IRequest<List<Notification>>
{
    public Guid GuardianId { get; set; }
}

internal class GetNotificationsByGuardianQueryHandler(
    INotificationRepository notificationRepository)
    : IRequestHandler<GetNotificationsByGuardianQuery, List<Notification>>
{
    public async Task<List<Notification>> Handle(
        GetNotificationsByGuardianQuery request,
        CancellationToken cancellationToken)
    {
        return await notificationRepository
            .GetByGuardianIdAsync(request.GuardianId);
    }
}