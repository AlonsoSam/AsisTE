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
    }

    public Task UpdateAsync(Student student)
    {
        context.Students.Update(student);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Student student)
    {
        context.Students.Remove(student);

        return Task.CompletedTask;
    }
    
    public async Task<Student?> GetByDniAsync(string dni)
    {
        return await context.Students
            .FirstOrDefaultAsync(x => x.Dni == dni);
    }
}