using AsisTE.Domain.Entities;

namespace AsisTE.Application.Ports.Services;

public interface ITokenService
{
    string CreateToken(User user);
}