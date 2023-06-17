namespace cubemeter_api.DTOs.Tenant.Incoming
{
    public class AddTenantRequest
    {
        public string Name { get; set; }
        public long PlaceId { get; set; }
        public int UnitId { get; set; }
        public string BuildingNumber { get; set; } = "";
        public string SerialNumber { get; set; }
        public string Gateway { get; set; }
        public string Remarks { get; set; }
    }
}