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
            new GetStudentByIdQuery
            {
                Id = id
            }
        );

        return Ok(student);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddStudentCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            studentId = id
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateStudentCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(
            new DeleteStudentCommand
            {
                Id = id
            }
        );

        return NoContent();
    }
}