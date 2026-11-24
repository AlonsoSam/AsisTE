using AsisTE.Application.UseCases.Attendances.Commands;
using AsisTE.Application.UseCases.Attendances.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador,Docente")]
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
            new GetAttendanceByIdQuery
            {
                Id = id
            }
        );

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
    
    [HttpGet("date/{date}")]
    public async Task<IActionResult> GetByDate(DateOnly date)
    {
        var attendances = await mediator.Send(
            new GetAttendancesByDateQuery
            {
                Date = date
            }
        );

        return Ok(attendances);
    }
    
    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetByStatus(string status)
    {
        var attendances = await mediator.Send(
            new GetAttendancesByStatusQuery
            {
                Status = status
            }
        );

        return Ok(attendances);
    }
    
    [HttpGet("student/{studentId}/range")]
    public async Task<IActionResult> GetByStudentAndDateRange(
        Guid studentId,
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate)
    {
        var attendances = await mediator.Send(
            new GetAttendancesByStudentAndDateRangeQuery
            {
                StudentId = studentId,
                StartDate = startDate,
                EndDate = endDate
            }
        );

        return Ok(attendances);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        AddAttendanceCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            attendanceId = id
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateAttendanceCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }
}