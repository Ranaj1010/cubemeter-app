using cubemeter_api.Base;
using cubemeter_api.Entities;

namespace cubemeter_api.Interfaces
{
    public interface IRawMeterReadingService : IBaseServiceAsync<RawMeterReading>
    {
        Task<RawMeterReading> GetLastReadingFromMeter(string meterId);
    }
}