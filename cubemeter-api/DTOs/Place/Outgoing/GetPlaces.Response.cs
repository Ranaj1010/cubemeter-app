using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Place
{
    public class GetPlacesResponse : BaseResponse
    {
        public GetPlacesResponse()
        {
            Data = new List<PlaceDto>();
        }
        public List<PlaceDto> Data { get; set; }
    }
}