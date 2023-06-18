using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Meter.Outgoing
{
    public class GetMetersWithKilowattHourResponse : BaseResponse
    {
        public GetMetersWithKilowattHourResponse()
        {
            Data = new List<CustomMeterDto>();
        }
        public List<CustomMeterDto> Data { get; set; }
    }
}