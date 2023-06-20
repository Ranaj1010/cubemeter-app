using cubemeter_api.Base;

namespace cubemeter_api.DTOs.MeterReading.Outgoing
{
    public class GeneratedMeterReadingReportResponse : BaseResponse
    {
        public GeneratedMeterReadingReportResponse()
        {
            Data = new List<GeneratedMeterReadingReport>();
        }
        public List<GeneratedMeterReadingReport> Data { get; set; }
    }

    public class GeneratedMeterReadingReport
    {
        public string MeterNo { get; set; }
        public double Reading { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public string Initial { get; set; }
        public string Building { get; set; }
        public string TenantName { get; set; }
        public string MeterType { get; set; }
        public double CurrentReading { get; set; }
        public double PreviousReading { get; set; }
        public double Multi { get; set; }
        public double CurrentConsumption { get; set; }
        public double PreviousConsumption { get; set; }
        public double PercentageDifference { get; set; }
    }
}