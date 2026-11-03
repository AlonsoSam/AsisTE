using AsisTE.Application.UseCases.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await mediator.Send(
            new GetUsersQuery()
        );

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await mediator.Send(
            new GetUserByIdQuery { Id = id }
        );

        if (user == null)
            return NotFound();

        return Ok(user);
    }
}