using AsisTE.Application.UseCases.Notifications.Commands;
using AsisTE.Application.UseCases.Notifications.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notifications = await mediator.Send(
            new GetNotificationsQuery()
        );

        return Ok(notifications);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var notification = await mediator.Send(
            new GetNotificationByIdQuery
            {
                Id = id
            }
        );

        if (notification == null)
            return NotFound();

        return Ok(notification);
    }

    [HttpGet("guardian/{guardianId}")]
    public async Task<IActionResult> GetByGuardian(Guid guardianId)
    {
        var notifications = await mediator.Send(
            new GetNotificationsByGuardianQuery
            {
                GuardianId = guardianId
            }
        );

        return Ok(notifications);
    }

    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetByStatus(string status)
    {
        var notifications = await mediator.Send(
            new GetNotificationsByStatusQuery
            {
                Status = status
            }
        );

        return Ok(notifications);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        AddNotificationCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            notificationId = id
        });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        UpdateNotificationStatusCommand command)
    {
        command.Id = id;

        var updated = await mediator.Send(command);

        if (!updated)
            return NotFound();

        return Ok();
    }

    [HttpPut("{id}/send")]
    public async Task<IActionResult> MarkAsSent(Guid id)
    {
        var updated = await mediator.Send(
            new MarkNotificationAsSentCommand
            {
                Id = id
            }
        );

        if (!updated)
            return NotFound();

        return Ok();
    }

    [HttpPut("{id}/reset")]
    public async Task<IActionResult> Reset(Guid id)
    {
        var updated = await mediator.Send(
            new ResetNotificationCommand
            {
                Id = id
            }
        );

        if (!updated)
            return NotFound();

        return Ok();
    }
}