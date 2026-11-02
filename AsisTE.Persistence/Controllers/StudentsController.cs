using AsisTE.Application.UseCases.Students.Commands;
using AsisTE.Application.UseCases.Students.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await mediator.Send(new GetStudentsQuery());
        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var student = await mediator.Send(
            new GetStudentByIdQuery { Id = id }
        );

        if (student == null)
            return NotFound();

        return Ok(student);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddStudentCommand command)
    {
        var id = await mediator.Send(command);
        return Ok(new { studentId = id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateStudentCommand command)
    {
        command.Id = id;

        var updated = await mediator.Send(command);

        if (!updated)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await mediator.Send(
            new DeleteStudentCommand { Id = id }
        );

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}