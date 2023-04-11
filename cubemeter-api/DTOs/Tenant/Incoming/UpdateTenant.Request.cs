using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace cubemeter_api.DTOs.Tenant.Incoming
{
    public class UpdateTenantRequest
    {
        public TenantDto Data { get; set; }
    }
}