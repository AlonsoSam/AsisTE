using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Commands;

public class DeleteDeviceCommand : IRequest
{
    public Guid Id { get; set; }
}

internal class DeleteDeviceCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteDeviceCommand>
{
    public async Task Handle(
        DeleteDeviceCommand request,
        CancellationToken cancellationToken)
    {
        var device = await unitOfWork.Devices.GetByIdAsync(request.Id);

        if (device == null)
            throw new KeyNotFoundException("Dispositivo no encontrado");

        await unitOfWork.Devices.DeleteAsync(device);
    }
}