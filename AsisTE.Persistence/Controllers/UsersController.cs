using AsisTE.Application.UseCases.Users.Commands;
using AsisTE.Application.UseCases.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
            new GetUserByIdQuery
            {
                Id = id
            }
        );

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddUserCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            userId = id
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateUserCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(
            new DeleteUserCommand
            {
                Id = id
            }
        );

        return NoContent();
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

        return Ok(user);
    }

    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(
        Guid id,
        ChangePasswordCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }
}