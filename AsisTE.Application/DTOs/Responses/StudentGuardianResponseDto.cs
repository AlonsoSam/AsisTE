namespace AsisTE.Application.DTOs.Responses;

public class StudentGuardianResponseDto
{
    public Guid GuardianId { get; set; }

    public string? Dni { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Relationship { get; set; }
}