using AsisTE.Application.UseCases.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using AsisTE.Application.UseCases.Users.Commands;

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
    [HttpPost]
    public async Task<IActionResult> Create(AddUserCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new { userId = id });
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateUserCommand command)
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
            new DeleteUserCommand { Id = id }
        );

        if (!deleted)
            return NotFound();

        return Ok();
    }
    [HttpGet("username/{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var user = await mediator.Send(
            new GetUserByUsernameQuery
            {
                Username = username
            }
        );

        if (user == null)
            return NotFound();

        return Ok(user);
    }
}