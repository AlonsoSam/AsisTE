using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Students.Commands;

public class DeleteStudentCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class DeleteStudentCommandHandler(IStudentRepository studentRepository)
    : IRequestHandler<DeleteStudentCommand, bool>
{
    public async Task<bool> Handle(
        DeleteStudentCommand request,
        CancellationToken cancellationToken)
    {
        var student = await studentRepository.GetByIdAsync(request.Id);

        if (student == null)
            return false;

        await studentRepository.DeleteAsync(student);

        return true;
    }
}