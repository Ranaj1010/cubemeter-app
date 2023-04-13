using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Meter.Outgoing
{
    public class GetMetersResponse : BaseResponse
    {

        public GetMetersResponse()
        {
            Data = new List<MeterDto>();
        }
        public List<MeterDto> Data { get; set; }
    }
}