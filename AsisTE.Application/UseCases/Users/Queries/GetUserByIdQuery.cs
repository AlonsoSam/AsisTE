using AsisTE.Application.DTOs.Responses;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Users.Queries;

public class GetUserByIdQuery : IRequest<UserResponseDto>
{
    public Guid Id { get; set; }
}

internal class GetUserByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetUserByIdQuery, UserResponseDto>
{
    public async Task<UserResponseDto> Handle(
        GetUserByIdQuery request,
        CancellationToken cancellationToken)
    {
        var user = await unitOfWork.Users.GetByIdAsync(request.Id);

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