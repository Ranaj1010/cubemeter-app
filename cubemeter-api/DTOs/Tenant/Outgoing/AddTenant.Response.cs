using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Tenant.Outgoing
{
    public class AddTenantResponse : BaseResponse
    {
        public TenantDto? Data { get; set; }
    }
}