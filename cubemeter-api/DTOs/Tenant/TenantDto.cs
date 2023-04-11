using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Tenant
{
    public class TenantDto : BaseDto
    {
        public string Name { get; set; }
        public long PlaceId { get; set; }
        public int UnitId { get; set; }
        public string SerialNumber { get; set; }
        public DateTime DateRegistered { get; set; }
        public string Gateway { get; set; }
        public string Remarks { get; set; }

    }
}