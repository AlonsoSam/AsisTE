using AsisTE.Application.UseCases.Devices.Commands;
using AsisTE.Application.UseCases.Devices.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DevicesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var devices = await mediator.Send(new GetDevicesQuery());

        return Ok(devices);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var device = await mediator.Send(
            new GetDeviceByIdQuery
            {
                Id = id
            }
        );

        return Ok(device);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddDeviceCommand command)
    {
        var id = await mediator.Send(command);

        return Ok(new
        {
            deviceId = id
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateDeviceCommand command)
    {
        command.Id = id;

        await mediator.Send(command);

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(
            new DeleteDeviceCommand
            {
                Id = id
            }
        );

        return NoContent();
    }
}