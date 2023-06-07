namespace cubemeter_api.DTOs.RawMeterReading.TopicPayloads
{
    public class ReadingFromMeterTopicDto
    {
        public string? Voltage { get; set; }
        public string? Kilowatthour { get; set; }
        public string? Kilowatt { get; set; }
        public string? Current { get; set; }
    }
}