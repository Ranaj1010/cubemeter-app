using cubemeter_api.Base;
using cubemeter_api.DTOs.Tenant;

namespace cubemeter_api.DTOs.Meter.Outgoing
{
    public class GetMetersByTenantResponse : BaseResponse
    {
        public GetMetersByTenantResponse()
        {
            Meters = new List<MeterDto>();
        }
        public long TenantId { get; set; }
        public TenantDto Tenant { get; set; }
        public List<MeterDto> Meters { get; set; }
    }
}