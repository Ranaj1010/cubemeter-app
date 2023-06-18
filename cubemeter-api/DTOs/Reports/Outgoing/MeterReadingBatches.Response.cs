using cubemeter_api.Base;

namespace cubemeter_api.DTOs.Reports.Outgoing
{
    public class MeterReadingBatchesResponse : BaseResponse
    {
        public MeterReadingBatchesResponse()
        {
            MeterReadingBatches = new List<MeterReadingBatchDto>();
        }
        public List<MeterReadingBatchDto> MeterReadingBatches { get; set; }
    }
}