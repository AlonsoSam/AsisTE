using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesByStatusQuery
    : IRequest<List<Attendance>>
{
    public string Status { get; set; } = null!;
}

internal class GetAttendancesByStatusQueryHandler(
    IUnitOfWork unitOfWork)
    : IRequestHandler<
        GetAttendancesByStatusQuery,
        List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesByStatusQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Attendances
            .GetByStatusAsync(request.Status);
    }
}