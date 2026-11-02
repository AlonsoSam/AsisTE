using System;
using System.Collections.Generic;

namespace AsisTE.Domain.Entities;
public partial class StudentGuardian
{
    public Guid StudentId { get; set; }

    public Guid GuardianId { get; set; }

    public string? Relationship { get; set; }

    public virtual Guardian Guardian { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
