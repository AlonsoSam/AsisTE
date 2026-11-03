using AsisTE.Application.UseCases.Roles.Commands;
using AsisTE.Application.UseCases.Roles.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
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
            new GetRoleByIdQuery { Id = id }
        );

        if (role == null)
            return NotFound();

        return Ok(role);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddRoleCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new { roleId = id });
    }
    [HttpPost("assign")]
    public async Task<IActionResult> AssignRole(
        AssignRoleCommand command)
    {
        var assigned = await mediator.Send(command);

        if (!assigned)
            return NotFound();

        return Ok();
    }
}