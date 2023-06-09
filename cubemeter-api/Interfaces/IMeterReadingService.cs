using cubemeter_api.Base;
using cubemeter_api.DTOs.MeterReading.Outgoing;
using cubemeter_api.Entities;

namespace cubemeter_api.Interfaces
{
    public interface IMeterReadingService : IBaseServiceAsync<MeterReading>
    {
        Task<MeterReading> GetPreviousReadingAsync(Meter meter);
        Task<MeterReading> GenerateReadingAsync(Meter meter, long batchId);
        Task<List<MeterReading>> GenerateReadingsAsync(List<Meter> meter);
        Task<List<GeneratedMeterReadingReport>> GenerateMeterReadingReportAsync(List<MeterReading> readings);
    }
}