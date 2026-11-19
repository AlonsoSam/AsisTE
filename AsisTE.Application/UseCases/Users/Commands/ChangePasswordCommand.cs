using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Commands;

public class ChangePasswordCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string PasswordHash { get; set; } = null!;
}

internal class ChangePasswordCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<ChangePasswordCommand, bool>
{
    public async Task<bool> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await unitOfWork.Users.GetByIdAsync(request.Id);

        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado");

        user.PasswordHash = request.PasswordHash;

        await unitOfWork.Users.UpdateAsync(user);

        await unitOfWork.SaveChangesAsync();

        return true;
    }
}