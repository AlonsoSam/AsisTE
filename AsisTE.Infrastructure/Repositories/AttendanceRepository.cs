using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class AttendanceRepository(AsisteContext context) : IAttendanceRepository
{
    public async Task<List<Attendance>> GetAllAsync()
    {
        return await context.Attendances
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Attendance?> GetByIdAsync(Guid id)
    {
        return await context.Attendances
            .FirstOrDefaultAsync(x => x.AttendanceId == id);
    }

    public async Task<List<Attendance>> GetByStudentIdAsync(Guid studentId)
    {
        return await context.Attendances
            .AsNoTracking()
            .Where(x => x.StudentId == studentId)
            .ToListAsync();
    }

    public async Task AddAsync(Attendance attendance)
    {
        await context.Attendances.AddAsync(attendance);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Attendance attendance)
    {
        context.Attendances.Update(attendance);
        await context.SaveChangesAsync();
    }
}