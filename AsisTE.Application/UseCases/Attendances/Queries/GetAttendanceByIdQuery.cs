using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Attendances.Queries;

public class GetAttendanceByIdQuery : IRequest<Attendance>
{
    public Guid Id { get; set; }
}

internal class GetAttendanceByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAttendanceByIdQuery, Attendance>
{
    public async Task<Attendance> Handle(
        GetAttendanceByIdQuery request,
        CancellationToken cancellationToken)
    {
        var attendance = await unitOfWork.Attendances.GetByIdAsync(request.Id);

        if (attendance == null)
            throw new KeyNotFoundException("Asistencia no encontrada");

        return attendance;
    }
}