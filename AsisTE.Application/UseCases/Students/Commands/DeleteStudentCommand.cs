using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class DeleteStudentCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteStudentCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteStudentCommand>
{
    public async Task Handle(
        DeleteStudentCommand request,
        CancellationToken cancellationToken)
    {
        var student = await unitOfWork.Students.GetByIdAsync(request.Id);

        if (student == null)
            throw new KeyNotFoundException("Estudiante no encontrado");

        await unitOfWork.Students.DeleteAsync(student);
    }
}