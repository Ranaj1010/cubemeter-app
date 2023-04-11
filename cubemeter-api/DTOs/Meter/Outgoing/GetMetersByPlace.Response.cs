using cubemeter_api.Base;
using cubemeter_api.DTOs.Place;

namespace cubemeter_api.DTOs.Meter.Outgoing
{
    public class GetMetersByPlaceResponse : BaseResponse
    {
        public GetMetersByPlaceResponse()
        {
            Meters = new List<MeterDto>();
        }
        public long PlaceId { get; set; }
        public PlaceDto Place { get; set; }
        public List<MeterDto> Meters { get; set; }
    }
}