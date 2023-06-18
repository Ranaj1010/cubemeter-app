using cubemeter_api.Base;

namespace cubemeter_api.Entities
{
    public class MeterReading : BaseEntity
    {

        public long MeterId { get; set; }
        public long MeterReadingBatchId { get; set; }
        public long TenantId { get; set; }
        public double CurrentReading { get; set; }
        public double PreviousReading { get; set; }
        public double Multi { get; set; }
        public double CurrentConsumption { get; set; }
        public double PreviousConsumption { get; set; }
        public double PercentageDifference { get; set; }
    }
}