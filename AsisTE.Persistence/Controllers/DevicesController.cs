using AsisTE.Application.UseCases.Devices.Commands;
using AsisTE.Application.UseCases.Devices.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AsisTE.Persistence.Controllers;

[ApiController]
[Route("api/[controller]")]
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
            new GetDeviceByIdQuery { Id = id }
        );

        if (device == null)
            return NotFound();

        return Ok(device);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddDeviceCommand command)
    {
        var id = await mediator.Send(command);
        return Ok(new { deviceId = id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateDeviceCommand command)
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
            new DeleteDeviceCommand { Id = id }
        );

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}