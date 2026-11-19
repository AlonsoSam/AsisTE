using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Queries;

public class GetDeviceByIdQuery : IRequest<Device>
{
    public Guid Id { get; set; }
}

internal class GetDeviceByIdQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetDeviceByIdQuery, Device>
{
    public async Task<Device> Handle(
        GetDeviceByIdQuery request,
        CancellationToken cancellationToken)
    {
        var device = await unitOfWork.Devices.GetByIdAsync(request.Id);

        if (device == null)
            throw new KeyNotFoundException("Dispositivo no encontrado");

        return device;
    }
}