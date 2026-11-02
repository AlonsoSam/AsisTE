using System;
using System.Collections.Generic;

namespace AsisTE.Domain.Entities;

public partial class Notification
{
    public Guid NotificationId { get; set; }

    public Guid? AttendanceId { get; set; }

    public Guid GuardianId { get; set; }

    public string Message { get; set; } = null!;

    public string? Status { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Attendance? Attendance { get; set; }

    public virtual Guardian Guardian { get; set; } = null!;
}
