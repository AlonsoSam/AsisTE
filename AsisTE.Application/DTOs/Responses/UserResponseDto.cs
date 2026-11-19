namespace AsisTE.Application.DTOs.Responses;

public class UserResponseDto
{
    public Guid UserId { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public DateTime? CreatedAt { get; set; }
}