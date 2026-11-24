using AsisTE.Application.DTOs.Responses;
using AsisTE.Application.Ports.Services;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Auth.Commands;

public class LoginCommand : IRequest<LoginResponseDto>
{
    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;
}

internal class LoginCommandHandler(
    IUnitOfWork unitOfWork,
    IPasswordService passwordService,
    ITokenService tokenService)
    : IRequestHandler<LoginCommand, LoginResponseDto>
{
    public async Task<LoginResponseDto> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user =
            await unitOfWork.Users.GetByUsernameAsync(
                request.Username
            );

        if (user == null)
            throw new UnauthorizedAccessException(
                "Usuario o contraseña incorrectos"
            );

        var validPassword =
            passwordService.VerifyPassword(
                request.Password,
                user.PasswordHash
            );

        if (!validPassword)
            throw new UnauthorizedAccessException(
                "Usuario o contraseña incorrectos"
            );

        var token = tokenService.CreateToken(user);

        return new LoginResponseDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Token = token
        };
    }
}