using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using AsisTE.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AsisTE.Infrastructure.Repositories;

public class StudentRepository(AsisteContext context) : IStudentRepository
{
    public async Task<List<Student>> GetAllAsync()
    {
        return await context.Students
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Student?> GetByIdAsync(Guid id)
    {
        return await context.Students
            .FirstOrDefaultAsync(x => x.StudentId == id);
    }

    public async Task AddAsync(Student student)
    {
        await context.Students.AddAsync(student);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Student student)
    {
        context.Students.Update(student);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Student student)
    {
        context.Students.Remove(student);
        await context.SaveChangesAsync();
    }
}