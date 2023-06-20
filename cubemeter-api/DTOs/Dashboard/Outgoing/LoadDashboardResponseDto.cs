using cubemeter_api.Base;
using cubemeter_api.DTOs.Tenant;

namespace cubemeter_api.DTOs.Dashboard.Outgoing
{
    public class LoadDashboardResponseDto : BaseResponse
    {
        public LoadDashboardResponseDto()
        {
            Data = new List<TenantLoadDto>();
        }
        public List<TenantLoadDto> Data { get; set; }
    }

    public class TenantLoadDto
    {
        public TenantDto Tenant { get; set; }
        public double Load { get; set; }
    }
}