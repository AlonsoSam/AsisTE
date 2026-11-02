using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Commands;

public class AddDeviceCommand : IRequest<Guid>
{
    public string DeviceCode { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Location { get; set; }
}

internal class AddDeviceCommandHandler(IDeviceRepository deviceRepository)
    : IRequestHandler<AddDeviceCommand, Guid>
{
    public async Task<Guid> Handle(
        AddDeviceCommand request,
        CancellationToken cancellationToken)
    {
        var device = new Device
        {
            DeviceId = Guid.NewGuid(),
            DeviceCode = request.DeviceCode,
            Name = request.Name,
            Location = request.Location,
            Active = true,
            CreatedAt = DateTime.Now
        };

        await deviceRepository.AddAsync(device);

        return device.DeviceId;
    }
}