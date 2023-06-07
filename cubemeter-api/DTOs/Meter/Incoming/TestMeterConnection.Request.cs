using System.ComponentModel.DataAnnotations;

namespace cubemeter_api.DTOs.Meter.Incoming
{
    public class TestMeterConnectionRequest
    {
        [Required]
        public string Topic { get; set; }
    }
}