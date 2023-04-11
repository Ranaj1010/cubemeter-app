using cubemeter_api.Base;
using cubemeter_api.DTOs.Place;

namespace cubemeter_api.DTOs.Tenant.Outgoing
{
    public class GetTenantsByPlaceResponse : BaseResponse
    {
        public GetTenantsByPlaceResponse()
        {
            Tenants = new List<TenantDto>();
        }
        public long PlaceId { get; set; }
        public PlaceDto? Place { get; set; }
        public List<TenantDto> Tenants { get; set; }
    }
}