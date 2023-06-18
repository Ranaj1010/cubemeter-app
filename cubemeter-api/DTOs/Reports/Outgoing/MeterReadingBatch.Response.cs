using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Reports.Outgoing
{
    public class MeterReadingBatchResponse : BaseResponse
    {
        public MeterReadingBatchDto Data { get; set; }
    }
}