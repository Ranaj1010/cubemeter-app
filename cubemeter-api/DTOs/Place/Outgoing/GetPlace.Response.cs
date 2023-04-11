using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Place.Outgoing
{
    public class GetPlaceResponse : BaseResponse
    {
        public PlaceDto? Data { get; set; }
    }
}