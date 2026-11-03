using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Commands;

public class DeleteUserCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class DeleteUserCommandHandler(
    IUserRepository userRepository)
    : IRequestHandler<DeleteUserCommand, bool>
{
    public async Task<bool> Handle(
        DeleteUserCommand request,
        CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.Id);

        if (user == null)
            return false;

        await userRepository.DeleteAsync(user);

        return true;
    }
}