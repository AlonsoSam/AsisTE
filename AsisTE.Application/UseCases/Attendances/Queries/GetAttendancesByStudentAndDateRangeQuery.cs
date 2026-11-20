using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendancesByStudentAndDateRangeQuery
    : IRequest<List<Attendance>>
{
    public Guid StudentId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }
}

internal class GetAttendancesByStudentAndDateRangeQueryHandler(
    IUnitOfWork unitOfWork)
    : IRequestHandler<
        GetAttendancesByStudentAndDateRangeQuery,
        List<Attendance>>
{
    public async Task<List<Attendance>> Handle(
        GetAttendancesByStudentAndDateRangeQuery request,
        CancellationToken cancellationToken)
    {
        var student =
            await unitOfWork.Students.GetByIdAsync(request.StudentId);

        if (student == null)
            throw new KeyNotFoundException("Estudiante no encontrado");

        if (request.StartDate > request.EndDate)
            throw new InvalidOperationException(
                "La fecha inicial no puede ser mayor que la fecha final"
            );

        return await unitOfWork.Attendances
            .GetByStudentAndDateRangeAsync(
                request.StudentId,
                request.StartDate,
                request.EndDate
            );
    }
}