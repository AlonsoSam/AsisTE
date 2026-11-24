using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AsisTE.Application.Ports.Services;
using AsisTE.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AsisTE.Infrastructure.Adapters.Services;

public class TokenService(IConfiguration configuration)
    : ITokenService
{
    public string CreateToken(User user)
    {
        var key = configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(key))
            throw new InvalidOperationException(
                "La configuración JWT no está disponible"
            );

        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                user.UserId.ToString()
            ),
            new(
                ClaimTypes.Name,
                user.Username
            )
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key)
        );

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        var durationMinutes =
            configuration.GetValue<int>("Jwt:DurationMinutes");

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(durationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}