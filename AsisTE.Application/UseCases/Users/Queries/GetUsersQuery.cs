using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Queries;

public class GetUsersQuery : IRequest<List<User>>
{
}

internal class GetUsersQueryHandler(
    IUserRepository userRepository)
    : IRequestHandler<GetUsersQuery, List<User>>
{
    public async Task<List<User>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken)
    {
        return await userRepository.GetAllAsync();
    }
}