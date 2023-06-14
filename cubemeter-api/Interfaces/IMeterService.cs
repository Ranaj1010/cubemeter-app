using cubemeter_api.Base;
using cubemeter_api.Entities;

namespace cubemeter_api.Interfaces
{
    public interface IMeterService : IBaseServiceAsync<Meter>
    {
        Task<List<Meter>> ListWithTenantAsync();
        Task<List<Meter>> ListFromTenantAsync(long tenantId);
    }
}