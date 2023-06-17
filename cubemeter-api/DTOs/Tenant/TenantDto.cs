using cubemeter_api.Base;
using cubemeter_api.DTOs.Place;

namespace cubemeter_api.DTOs.Tenant
{
    public class TenantDto : BaseDto
    {
        public string Name { get; set; }
        public long PlaceId { get; set; }
        public int UnitId { get; set; }
        public string BuildingNumber { get; set; }
        public string SerialNumber { get; set; }
        public DateTime DateRegistered { get; set; }
        public string Gateway { get; set; }
        public string Remarks { get; set; }

        public virtual PlaceDto? Place { get; set; }

    }
}