using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Place
{
    public class AddPlaceResponse : BaseResponse
    {
        public PlaceDto? Data { get; set; }
    }
}