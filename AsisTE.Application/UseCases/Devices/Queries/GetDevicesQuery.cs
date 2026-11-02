using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Queries;

public class GetDevicesQuery : IRequest<List<Device>>
{
}

internal class GetDevicesQueryHandler(IDeviceRepository deviceRepository)
    : IRequestHandler<GetDevicesQuery, List<Device>>
{
    public async Task<List<Device>> Handle(
        GetDevicesQuery request,
        CancellationToken cancellationToken)
    {
        return await deviceRepository.GetAllAsync();
    }
}