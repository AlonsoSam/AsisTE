using System;
using System.Collections.Generic;

namespace AsisTE.Domain.Entities;

public partial class Device
{
    public Guid DeviceId { get; set; }

    public string DeviceCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Location { get; set; }

    public bool? Active { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}
