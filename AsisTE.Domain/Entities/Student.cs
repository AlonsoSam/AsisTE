using System;
using System.Collections.Generic;

namespace AsisTE.Domain.Entities;

public partial class Student
{
    public Guid StudentId { get; set; }

    public string? Dni { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Grade { get; set; }

    public string? Section { get; set; }

    public bool? Active { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<StudentGuardian> StudentGuardians { get; set; } = new List<StudentGuardian>();
}
