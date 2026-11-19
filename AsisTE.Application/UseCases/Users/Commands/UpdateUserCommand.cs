using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Commands;

public class UpdateUserCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? Email { get; set; }
}

internal class UpdateUserCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateUserCommand, bool>
{
    public async Task<bool> Handle(
        UpdateUserCommand request,
        CancellationToken cancellationToken)
    {
        var user = await unitOfWork.Users.GetByIdAsync(request.Id);

        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado");

        var existingUser =
            await unitOfWork.Users.GetByUsernameAsync(request.Username);

        if (existingUser != null &&
            existingUser.UserId != request.Id)
        {
            throw new InvalidOperationException(
                "El nombre de usuario ya está registrado"
            );
        }

        user.Username = request.Username;
        user.Email = request.Email;

        await unitOfWork.Users.UpdateAsync(user);

        return true;
    }
}