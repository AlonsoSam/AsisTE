using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Commands;

public class ChangePasswordCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string PasswordHash { get; set; } = null!;
}

internal class ChangePasswordCommandHandler(
    IUserRepository userRepository)
    : IRequestHandler<ChangePasswordCommand, bool>
{
    public async Task<bool> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id);

        if (user == null)
            return false;

        user.PasswordHash = request.PasswordHash;

        await userRepository.UpdateAsync(user);

        return true;
    }
}