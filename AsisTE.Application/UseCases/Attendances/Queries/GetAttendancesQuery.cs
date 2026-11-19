using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesQuery : IRequest<List<Attendance>>
{
}

internal class GetAttendancesQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAttendancesQuery, List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Attendances.GetAllAsync();
    }
}