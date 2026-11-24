using AsisTE.Application.UseCases.Students.Commands;
using AsisTE.Application.UseCases.Students.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador,Docente")]
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
    
    [HttpGet("{studentId}/guardians")]
    public async Task<IActionResult> GetGuardians(Guid studentId)
    {
        var guardians = await mediator.Send(
            new GetGuardiansByStudentQuery
            {
                StudentId = studentId
            }
        );

        return Ok(guardians);
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
    
    [HttpPost("{studentId}/guardians")]
    public async Task<IActionResult> AssignGuardian(
        Guid studentId,
        AssignGuardianToStudentCommand command)
    {
        command.StudentId = studentId;

        await mediator.Send(command);

        return Ok();
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
    
    [HttpDelete("{studentId}/guardians/{guardianId}")]
    public async Task<IActionResult> RemoveGuardian(
        Guid studentId,
        Guid guardianId)
    {
        await mediator.Send(
            new RemoveGuardianFromStudentCommand
            {
                StudentId = studentId,
                GuardianId = guardianId
            }
        );

        return NoContent();
    }
}