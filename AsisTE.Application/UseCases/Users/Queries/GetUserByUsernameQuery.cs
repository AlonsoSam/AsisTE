using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Queries;

public class GetUserByUsernameQuery : IRequest<User?>
{
    public string Username { get; set; } = null!;
}

internal class GetUserByUsernameQueryHandler(
    IUserRepository userRepository)
    : IRequestHandler<GetUserByUsernameQuery, User?>
{
    public async Task<User?> Handle(
        GetUserByUsernameQuery request,
        CancellationToken cancellationToken)
    {
        return await userRepository.GetByUsernameAsync(request.Username);
    }
}