using AsisTE.Application.UseCases.Roles.Commands;
using AsisTE.Application.UseCases.Roles.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador")]
public class RolesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var roles = await mediator.Send(
            new GetRolesQuery()
        );

        return Ok(roles);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var role = await mediator.Send(
            new GetRoleByIdQuery
            {
                Id = id
            }
        );

        return Ok(role);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddRoleCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            roleId = id
        });
    }

    [HttpPost("assign")]
    public async Task<IActionResult> AssignRole(
        AssignRoleCommand command)
    {
        await mediator.Send(command);

        return Ok();
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateRoleCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(
            new DeleteRoleCommand
            {
                Id = id
            }
        );

        return NoContent();
    }
}