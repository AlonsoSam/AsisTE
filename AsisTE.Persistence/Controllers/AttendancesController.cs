using AsisTE.Application.UseCases.Attendances.Commands;
using AsisTE.Application.UseCases.Attendances.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendancesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var attendances = await mediator.Send(
            new GetAttendancesQuery()
        );

        return Ok(attendances);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var attendance = await mediator.Send(
            new GetAttendanceByIdQuery { Id = id }
        );

        if (attendance == null)
            return NotFound();

        return Ok(attendance);
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(Guid studentId)
    {
        var attendances = await mediator.Send(
            new GetAttendancesByStudentQuery
            {
                StudentId = studentId
            }
        );

        return Ok(attendances);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        AddAttendanceCommand command)
    {
        var id = await mediator.Send(command);
        return Ok(new { attendanceId = id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateAttendanceCommand command)
    {
        command.Id = id;

        var updated = await mediator.Send(command);

        if (!updated)
            return NotFound();

        return Ok();
    }
}