using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Commands;

public class DeleteDeviceCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

internal class DeleteDeviceCommandHandler(IDeviceRepository deviceRepository)
    : IRequestHandler<DeleteDeviceCommand, bool>
{
    public async Task<bool> Handle(
        DeleteDeviceCommand request,
        CancellationToken cancellationToken)
    {
        var device = await deviceRepository.GetByIdAsync(request.Id);

        if (device == null)
            return false;

        await deviceRepository.DeleteAsync(device);

        return true;
    }
}