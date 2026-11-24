namespace AsisTE.Application.Ports.Services;

public interface IAiService
{
    Task<string> GenerateAttendanceSummaryAsync(
        string studentName,
        string attendanceData,
        CancellationToken cancellationToken);
}