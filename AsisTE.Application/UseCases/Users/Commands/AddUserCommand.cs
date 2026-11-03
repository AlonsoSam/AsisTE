using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Commands;

public class AddUserCommand : IRequest<Guid>
{
    public string Username { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? Email { get; set; }
}

internal class AddUserCommandHandler(
    IUserRepository userRepository)
    : IRequestHandler<AddUserCommand, Guid>
{
    public async Task<Guid> Handle(
        AddUserCommand request,
        CancellationToken cancellationToken)
    {
        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = request.PasswordHash,
            Email = request.Email,
            CreatedAt = DateTime.Now
        };

        await userRepository.AddAsync(user);

        return user.UserId;
    }
}