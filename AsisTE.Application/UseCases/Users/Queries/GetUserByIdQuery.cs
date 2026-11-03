using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Queries;

public class GetUserByIdQuery : IRequest<User?>
{
    public Guid Id { get; set; }
}

internal class GetUserByIdQueryHandler(
    IUserRepository userRepository)
    : IRequestHandler<GetUserByIdQuery, User?>
{
    public async Task<User?> Handle(
        GetUserByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await userRepository.GetByIdAsync(request.Id);
    }
}