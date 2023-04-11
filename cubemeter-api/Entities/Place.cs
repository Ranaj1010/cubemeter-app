using System.ComponentModel.DataAnnotations.Schema;
using cubemeter_api.Base;
using NetTopologySuite.Geometries;

namespace cubemeter_api.Entities
{
    public class Place : BaseEntity
    {

        public string Name { get; set; }
        public string Timezone { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Currency { get; set; } = "Php";
        public string SerialNumber { get; set; }
        public int BillingDay { get; set; }
        public int SortNumber { get; set; }
        [Column(TypeName = "geometry (point)")]
        public Point MapCoordinates { get; set; }
        
        public virtual ICollection<Tenant> Tenants { get; set; }
    }
}