using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Meter.Outgoing
{
    public class GetMeterResponse : BaseResponse
    {
        public MeterDto? Data { get; set; }
    }
}