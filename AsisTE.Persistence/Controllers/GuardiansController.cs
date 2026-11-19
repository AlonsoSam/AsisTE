using AsisTE.Application.UseCases.Guardians.Commands;
using AsisTE.Application.UseCases.Guardians.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GuardiansController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var guardians = await mediator.Send(new GetGuardiansQuery());

        return Ok(guardians);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var guardian = await mediator.Send(
            new GetGuardianByIdQuery
            {
                Id = id
            }
        );

        return Ok(guardian);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddGuardianCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            guardianId = id
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateGuardianCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(
            new DeleteGuardianCommand
            {
                Id = id
            }
        );

        return NoContent();
    }
}