using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Commands;

public class UpdateDeviceCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string DeviceCode { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Location { get; set; }
    public bool Active { get; set; }
}

internal class UpdateDeviceCommandHandler(IDeviceRepository deviceRepository)
    : IRequestHandler<UpdateDeviceCommand, bool>
{
    public async Task<bool> Handle(
        UpdateDeviceCommand request,
        CancellationToken cancellationToken)
    {
        var device = await deviceRepository.GetByIdAsync(request.Id);

        if (device == null)
            return false;

        device.DeviceCode = request.DeviceCode;
        device.Name = request.Name;
        device.Location = request.Location;
        device.Active = request.Active;

        await deviceRepository.UpdateAsync(device);

        return true;
    }
}