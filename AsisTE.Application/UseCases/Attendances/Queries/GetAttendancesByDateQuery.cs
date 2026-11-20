using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesByDateQuery : IRequest<List<Attendance>>
{
    public DateOnly Date { get; set; }
}

internal class GetAttendancesByDateQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAttendancesByDateQuery, List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesByDateQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Attendances
            .GetByDateAsync(request.Date);
    }
}