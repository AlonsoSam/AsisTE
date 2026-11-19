using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationsByStatusQuery : IRequest<List<Notification>>
{
    public string Status { get; set; } = null!;
}

internal class GetNotificationsByStatusQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetNotificationsByStatusQuery, List<Notification>>
{
    public async Task<List<Notification>> Handle(
        GetNotificationsByStatusQuery request,
        CancellationToken cancellationToken)
    {
        var notifications =
            await unitOfWork.Notifications.GetAllAsync();

        return notifications
            .Where(notification =>
                notification.Status != null &&
                notification.Status.Equals(
                    request.Status,
                    StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}