using cubemeter_api.Base;

namespace cubemeter_api.DTOs.RawMeterReading
{
    public class RawMeterReadingDto : BaseDto
    {
        public string Topic { get; set; }
        public string Gateway { get; set; }
        public string MeterName { get; set; }
        public double Voltage { get; set; }
        public double Kilowatthour { get; set; }
        public double Kilowatt { get; set; }
        public double Current { get; set; }
    }
}