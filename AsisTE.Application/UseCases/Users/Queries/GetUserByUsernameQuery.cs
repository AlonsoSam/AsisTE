using AsisTE.Application.DTOs.Responses;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Queries;

public class GetUserByUsernameQuery : IRequest<UserResponseDto>
{
    public string Username { get; set; } = null!;
}

internal class GetUserByUsernameQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetUserByUsernameQuery, UserResponseDto>
{
    public async Task<UserResponseDto> Handle(
        GetUserByUsernameQuery request,
        CancellationToken cancellationToken)
    {
        var user =
            await unitOfWork.Users.GetByUsernameAsync(request.Username);

        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado");

        return new UserResponseDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }
}