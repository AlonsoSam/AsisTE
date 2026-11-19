using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Commands;

public class AddDeviceCommand : IRequest<Guid>
{
    public string DeviceCode { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Location { get; set; }
}

internal class AddDeviceCommandHandler(IUnitOfWork unitOfWork)
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

        await unitOfWork.Devices.AddAsync(device);

        await unitOfWork.SaveChangesAsync();

        return device.DeviceId;
    }
}