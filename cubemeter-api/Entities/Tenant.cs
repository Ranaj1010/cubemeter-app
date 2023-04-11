using cubemeter_api.Base;

namespace cubemeter_api.Entities
{
    public class Tenant : BaseEntity
    {
        public string Name { get; set; }
        public long PlaceId { get; set; }
        public int UnitId { get; set; }
        public string SerialNumber { get; set; }
        public DateTime DateRegistered { get; set; }
        public string Gateway { get; set; }
        public string Remarks { get; set; }        
        public virtual Place Place { get; set; }
        public virtual ICollection<Meter> Meters { get; set; }
    }
}