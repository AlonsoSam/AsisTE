using AsisTE.Domain.Entities;

namespace AsisTE.Domain.Ports.Repositories;

public interface IStudentGuardianRepository
{
    Task<List<StudentGuardian>> GetByStudentIdAsync(Guid studentId);

    Task<StudentGuardian?> GetAsync(
        Guid studentId,
        Guid guardianId);

    Task AddAsync(StudentGuardian studentGuardian);

    Task DeleteAsync(StudentGuardian studentGuardian);
}