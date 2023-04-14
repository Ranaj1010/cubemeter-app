using cubemeter_api.Base;
using cubemeter_api.DTOs.Meter;

namespace cubemeter_api.DTOs.Gateway.V1
{
    public class GetMetersWithTenantResponse : BaseResponse
    {

        public GetMetersWithTenantResponse()
        {
            Data = new List<MeterDto>();
        }
        public List<MeterDto> Data { get; set; }

    }
}