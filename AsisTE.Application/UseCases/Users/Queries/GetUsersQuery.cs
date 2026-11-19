using AsisTE.Application.DTOs.Responses;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Queries;

public class GetUsersQuery : IRequest<List<UserResponseDto>>
{
}

internal class GetUsersQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetUsersQuery, List<UserResponseDto>>
{
    public async Task<List<UserResponseDto>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken)
    {
        var users = await unitOfWork.Users.GetAllAsync();

        return users
            .Select(user => new UserResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            })
            .ToList();
    }
}