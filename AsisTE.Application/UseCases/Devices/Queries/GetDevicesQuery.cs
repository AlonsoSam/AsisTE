using AsisTE.Domain.Entities;
using AsisTE.Domain.Ports.UnitOfWork;
using MediatR;

namespace AsisTE.Application.UseCases.Devices.Queries;

public class GetDevicesQuery : IRequest<List<Device>>
{
}

internal class GetDevicesQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetDevicesQuery, List<Device>>
{
    public async Task<List<Device>> Handle(
        GetDevicesQuery request,
        CancellationToken cancellationToken)
    {
        return await unitOfWork.Devices.GetAllAsync();
    }
}