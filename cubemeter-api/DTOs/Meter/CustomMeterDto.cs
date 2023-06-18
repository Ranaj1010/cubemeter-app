using cubemeter_api.Base;
using cubemeter_api.DTOs.Tenant;
using cubemeter_api.Utilities;

namespace cubemeter_api.DTOs.Meter
{
    public class CustomMeterDto : BaseDto
    {
        public string Name { get; set; }
        public long TenantId { get; set; }
        public string SerialNumber { get; set; }
        public double Kilowatthour { get; set; }
        public MeterTypeEnums MeterType { get; set; }
        public MeterUploadTypeEnums MeterUploadType { get; set; }
        public string Ratio { get; set; }
        public string Remarks { get; set; }
        public int SortNumber { get; set; }

        public virtual TenantDto? Tenant { get; set; }
    }
}