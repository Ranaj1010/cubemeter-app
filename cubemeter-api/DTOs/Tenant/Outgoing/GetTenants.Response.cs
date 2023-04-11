using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Tenant.Outgoing
{
    public class GetTenantsResponse : BaseResponse
    {
        public GetTenantsResponse()
        {
            Data = new List<TenantDto>();
        }
        public List<TenantDto> Data { get; set; }
    }
}