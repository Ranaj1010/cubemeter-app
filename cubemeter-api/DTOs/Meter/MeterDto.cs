using cubemeter_api.Base;
using cubemeter_api.Utilities;

namespace cubemeter_api.DTOs.Meter
{
    public class MeterDto : BaseDto
    {
        public string Name { get; set; }
        public long TenantId { get; set; }
        public string SerialNumber { get; set; }
        public MeterTypeEnums MeterType { get; set; }
        public MeterUploadTypeEnums MeterUploadType { get; set; }
        public string Ratio { get; set; }
        public string Remarks { get; set; }
        public int SortNumber { get; set; }
    }
}