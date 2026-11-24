using AsisTE.Application.Ports.Services;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Queries;

public class GetStudentAttendanceAiSummaryQuery
    : IRequest<string>
{
    public Guid StudentId { get; set; }
}

internal class GetStudentAttendanceAiSummaryQueryHandler(
    IUnitOfWork unitOfWork,
    IAiService aiService)
    : IRequestHandler<
        GetStudentAttendanceAiSummaryQuery,
        string>
{
    public async Task<string> Handle(
        GetStudentAttendanceAiSummaryQuery request,
        CancellationToken cancellationToken)
    {
        var student =
            await unitOfWork.Students.GetByIdAsync(
                request.StudentId
            );

        if (student == null)
            throw new KeyNotFoundException(
                "Estudiante no encontrado"
            );

        var attendances =
            await unitOfWork.Attendances
                .GetByStudentIdAsync(
                    request.StudentId
                );

        var studentName =
            $"{student.FirstName} {student.LastName}";

        string attendanceData;

        if (attendances.Count == 0)
        {
            attendanceData =
                "El estudiante no tiene registros de asistencia.";
        }
        else
        {
            attendanceData = string.Join(
                Environment.NewLine,
                attendances.Select(attendance =>
                    $"- Fecha: {attendance.AttendanceDate}, " +
                    $"estado: {attendance.Status}, " +
                    $"entrada: {attendance.EntryTime}, " +
                    $"salida: {attendance.ExitTime}"
                )
            );
        }

        return await aiService
            .GenerateAttendanceSummaryAsync(
                studentName,
                attendanceData,
                cancellationToken
            );
    }
}