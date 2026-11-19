using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Notifications.Queries;

public class GetNotificationsByGuardianQuery : IRequest<List<Notification>>
{
    public Guid GuardianId { get; set; }
}

internal class GetNotificationsByGuardianQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetNotificationsByGuardianQuery, List<Notification>>
{
    public async Task<List<Notification>> Handle(
        GetNotificationsByGuardianQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Notifications
            .GetByGuardianIdAsync(request.GuardianId);
    }
}