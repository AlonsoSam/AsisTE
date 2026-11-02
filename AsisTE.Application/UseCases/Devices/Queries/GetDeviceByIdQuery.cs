using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.Repositories;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Queries;

public class GetDeviceByIdQuery : IRequest<Device?>
{
    public Guid Id { get; set; }
}

internal class GetDeviceByIdQueryHandler(IDeviceRepository deviceRepository)
    : IRequestHandler<GetDeviceByIdQuery, Device?>
{
    public async Task<Device?> Handle(
        GetDeviceByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await deviceRepository.GetByIdAsync(request.Id);
    }
}