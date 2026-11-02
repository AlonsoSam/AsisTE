using System;
using System.Collections.Generic;

namespace AsisTE.Domain.Entities;

public partial class Attendance
{
    public Guid AttendanceId { get; set; }

    public Guid StudentId { get; set; }

    public Guid? DeviceId { get; set; }

    public DateOnly AttendanceDate { get; set; }

    public DateTime? EntryTime { get; set; }

    public DateTime? ExitTime { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual Device? Device { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Student Student { get; set; } = null!;
}
