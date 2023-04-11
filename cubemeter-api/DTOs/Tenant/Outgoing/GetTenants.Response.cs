using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Tenant.Outgoing
{
    public class GetTenantsResponse : BaseResponse
    {
        public GetTenantsResponse()
        {
            Tenants = new List<TenantDto>();
        }
        public List<TenantDto> Tenants { get; set; }
    }
}