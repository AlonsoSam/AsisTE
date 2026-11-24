namespace AsisTE.Application.DTOs.Responses;

public class LoginResponseDto
{
    public Guid UserId { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public string Token { get; set; } = null!;
}