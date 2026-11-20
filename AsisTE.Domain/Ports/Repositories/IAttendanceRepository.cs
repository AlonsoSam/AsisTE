using AsisTE.Domain.Entities;

namespace AsisTE.Domain.Ports.Repositories;

public interface IAttendanceRepository
{
    Task<List<Attendance>> GetAllAsync();
    Task<Attendance?> GetByIdAsync(Guid id);
    Task<List<Attendance>> GetByStudentIdAsync(Guid studentId);
    Task<List<Attendance>> GetByDateAsync(DateOnly date);
    Task<List<Attendance>> GetByStatusAsync(string status);
    Task<List<Attendance>> GetByStudentAndDateRangeAsync(Guid studentId, DateOnly startDate, DateOnly endDate);
    Task AddAsync(Attendance attendance);
    Task UpdateAsync(Attendance attendance);
}