using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class StudentGuardianRepository(AsisteContext context)
    : IStudentGuardianRepository
{
    public async Task<List<StudentGuardian>> GetByStudentIdAsync(
        Guid studentId)
    {
        return await context.StudentGuardians
            .AsNoTracking()
            .Where(x => x.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<StudentGuardian?> GetAsync(
        Guid studentId,
        Guid guardianId)
    {
        return await context.StudentGuardians
            .FirstOrDefaultAsync(x =>
                x.StudentId == studentId &&
                x.GuardianId == guardianId);
    }

    public async Task AddAsync(StudentGuardian studentGuardian)
    {
        await context.StudentGuardians.AddAsync(studentGuardian);
    }

    public Task DeleteAsync(StudentGuardian studentGuardian)
    {
        context.StudentGuardians.Remove(studentGuardian);

        return Task.CompletedTask;
    }
}