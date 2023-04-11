namespace cubemeter_api.DTOs.Place
{
    public class AddPlaceRequest
    {
        public string Name { get; set; }
        public string Timezone { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Currency { get; set; }
        public string SerialNumber { get; set; }
        public int BillingDay { get; set; }
        public int SortNumber { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}