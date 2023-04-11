using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Tenant.Outgoing
{
    public class GetTenantResponse : BaseResponse
    {
        public TenantDto? Data { get; set; }
    }
}