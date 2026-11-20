using AsisTE.Application.DTOs.Responses;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Queries;

public class GetGuardiansByStudentQuery
    : IRequest<List<StudentGuardianResponseDto>>
{
    public Guid StudentId { get; set; }
}

internal class GetGuardiansByStudentQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<
        GetGuardiansByStudentQuery,
        List<StudentGuardianResponseDto>>
{
    public async Task<List<StudentGuardianResponseDto>> Handle(
        GetGuardiansByStudentQuery request,
        CancellationToken cancellationToken)
    {
        var student =
            await unitOfWork.Students.GetByIdAsync(request.StudentId);

        if (student == null)
            throw new KeyNotFoundException("Estudiante no encontrado");

        var relations =
            await unitOfWork.StudentGuardians
                .GetByStudentIdAsync(request.StudentId);

        return relations
            .Select(x => new StudentGuardianResponseDto
            {
                GuardianId = x.GuardianId,
                Dni = x.Guardian.Dni,
                FirstName = x.Guardian.FirstName,
                LastName = x.Guardian.LastName,
                Phone = x.Guardian.Phone,
                Email = x.Guardian.Email,
                Relationship = x.Relationship
            })
            .ToList();
    }
}