using cubemeter_api.Base;
using cubemeter_api.DTOs.Tenant;

namespace cubemeter_api.DTOs.Dashboard.Outgoing
{
    public class PowerConsumptionDashboardResponseDto : BaseResponse
    {
        public PowerConsumptionDashboardResponseDto()
        {
            Data = new List<TenantPowerConsumptionDto>();
        }
        public List<TenantPowerConsumptionDto> Data { get; set; }
    }

    public class TenantPowerConsumptionDto
    {
        public TenantDto Tenant { get; set; }
        public double PowerConsumption { get; set; }
    }
}