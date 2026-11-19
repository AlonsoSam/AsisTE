using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Commands;

public class UpdateDeviceCommand : IRequest
{
    public Guid Id { get; set; }
    public string DeviceCode { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Location { get; set; }
    public bool Active { get; set; }
}

internal class UpdateDeviceCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateDeviceCommand>
{
    public async Task Handle(
        UpdateDeviceCommand request,
        CancellationToken cancellationToken)
    {
        var device = await unitOfWork.Devices.GetByIdAsync(request.Id);

        if (device == null)
            throw new KeyNotFoundException("Dispositivo no encontrado");

        device.DeviceCode = request.DeviceCode;
        device.Name = request.Name;
        device.Location = request.Location;
        device.Active = request.Active;

        await unitOfWork.Devices.UpdateAsync(device);

        await unitOfWork.SaveChangesAsync();
    }
}