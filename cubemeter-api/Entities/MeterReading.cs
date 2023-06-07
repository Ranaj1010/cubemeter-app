using cubemeter_api.Base;

namespace cubemeter_api.Entities
{
    public class MeterReading : BaseEntity
    {

        public long MeterId { get; set; }
        public long TenantId { get; set; }
        public double CurrentReading { get; set; }
        public double PreviousReading { get; set; }
        public double Multi { get; set; }
        public double CurrentConsumption
        {
            get { return CurrentReading - PreviousReading; }
            set { value = CurrentReading - PreviousReading; }
        }
        public double PreviousConsumption { get; set; }
        public double PercentageDifference
        {
            get { return PreviousConsumption > 0 ? (CurrentConsumption - PreviousConsumption) / PreviousConsumption : 0; }
            set { value = PreviousConsumption > 0 ? (CurrentConsumption - PreviousConsumption) / PreviousConsumption : 0; }
        }
    }
}