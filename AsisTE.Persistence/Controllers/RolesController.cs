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
}