using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Commands;

public class AddUserCommand : IRequest<Guid?>
{
    public string Username { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? Email { get; set; }
}

internal class AddUserCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<AddUserCommand, Guid?>
{
    public async Task<Guid?> Handle(
        AddUserCommand request,
        CancellationToken cancellationToken)
    {
        var existingUser =
            await unitOfWork.Users.GetByUsernameAsync(request.Username);

        if (existingUser != null)
            throw new InvalidOperationException(
                "El nombre de usuario ya está registrado"
            );

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = request.PasswordHash,
            Email = request.Email,
            CreatedAt = DateTime.Now
        };

        await unitOfWork.Users.AddAsync(user);

        await unitOfWork.SaveChangesAsync();

        return user.UserId;
    }
}