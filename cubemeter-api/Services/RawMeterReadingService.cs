using System.Linq.Expressions;
using cubemeter_api.Data;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Services
{
    public class RawMeterReadingService : IRawMeterReadingService
    {
        private readonly DataContext _dbContext;
        public RawMeterReadingService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<RawMeterReading> AddAsync(RawMeterReading entity)
        {
            await _dbContext.RawMeterReadings.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<List<RawMeterReading>> AddRangeAsync(List<RawMeterReading> entities)
        {
            await _dbContext.RawMeterReadings.AddRangeAsync(entities);
            await _dbContext.SaveChangesAsync();
            return entities;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            try
            {
                var existingData = await _dbContext.RawMeterReadings.SingleOrDefaultAsync(result => result.Id.Equals(id));

                if (existingData == null) return false;

                existingData.Active = false;

                _dbContext.RawMeterReadings.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        public async Task<RawMeterReading> GetAsync(Expression<Func<RawMeterReading, bool>> expression) => await _dbContext.RawMeterReadings.SingleOrDefaultAsync(expression);

        public async Task<RawMeterReading?> GetLastReadingFromMeter(string meterName)
        {
            var readings = await _dbContext.RawMeterReadings.Where(reading => reading.MeterName == meterName).ToListAsync();

            return readings.Count > 0 ? readings.Last() : null;
        }

        public async Task<List<RawMeterReading>> ListAsync(Expression<Func<RawMeterReading, bool>> expression) => await _dbContext.RawMeterReadings.Where(expression).ToListAsync();

        public async Task<bool> UpdateAsync(RawMeterReading entity)
        {
            try
            {
                var existingData = await _dbContext.RawMeterReadings.SingleOrDefaultAsync(result => result.Id.Equals(entity.Id));

                if (existingData == null) return false;

                _dbContext.RawMeterReadings.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }
    }
}