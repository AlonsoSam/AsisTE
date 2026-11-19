using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationsQuery : IRequest<List<Notification>>
{
}

internal class GetNotificationsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetNotificationsQuery, List<Notification>>
{
    public async Task<List<Notification>> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Notifications.GetAllAsync();
    }
}