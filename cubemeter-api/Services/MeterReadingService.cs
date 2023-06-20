using System.Linq.Expressions;
using cubemeter_api.Data;
using cubemeter_api.DTOs.MeterReading.Outgoing;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Services
{
    public class MeterReadingService : IMeterReadingService
    {
        private readonly IMeterService _meterService;
        private readonly IRawMeterReadingService _rawMeterReadingService;
        private readonly IMeterReadingBatchService _meterReadingBatchService;
        private readonly DataContext _dbContext;
        public MeterReadingService(DataContext dbContext, IMeterService meterService, IRawMeterReadingService rawMeterReadingService, IMeterReadingBatchService meterReadingBatchService)
        {
            _dbContext = dbContext;
            _meterService = meterService;
            _rawMeterReadingService = rawMeterReadingService;
            _meterReadingBatchService = meterReadingBatchService;
        }

        public async Task<MeterReading> AddAsync(MeterReading entity)
        {
            await _dbContext.MeterReadings.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<List<MeterReading>> AddRangeAsync(List<MeterReading> entities)
        {
            await _dbContext.MeterReadings.AddRangeAsync(entities);
            await _dbContext.SaveChangesAsync();
            return entities;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            try
            {
                var existingData = await _dbContext.MeterReadings.SingleOrDefaultAsync(result => result.Id.Equals(id));

                if (existingData == null) return false;

                existingData.Active = false;

                _dbContext.MeterReadings.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        public async Task<List<GeneratedMeterReadingReport>> GenerateMeterReadingReportAsync(List<MeterReading> readings)
        {
            var reports = new List<GeneratedMeterReadingReport>();

            var readingsWithMeter = readings.Join(_dbContext.Meters, reading => reading.MeterId, meter => meter.Id, (reading, meter) => new { reading, meter });

            var readingsWithMetersAndTenants = readingsWithMeter.Join(_dbContext.Tenants, reading => reading.meter.TenantId, tenant => tenant.Id, (reading, tenant) => new { reading.reading, reading.meter, tenant });

            reports = readingsWithMetersAndTenants.Select(reading => new GeneratedMeterReadingReport
            {
                MeterNo = reading.meter.SerialNumber,
                Reading = reading.reading.CurrentReading,
                Date = DateOnly.FromDateTime(reading.reading.CreatedAt),
                Time = TimeOnly.FromDateTime(reading.reading.CreatedAt),
                Building = reading.tenant.BuildingNumber,
                TenantName = reading.tenant.Name,
                CurrentReading = reading.reading.CurrentReading,
                CurrentConsumption = reading.reading.CurrentConsumption,
                Initial = "",
                MeterType = reading.meter.MeterType.ToString(),
                Multi = reading.reading.Multi,
                PercentageDifference = reading.reading.PercentageDifference,
                PreviousConsumption = reading.reading.PreviousConsumption,
                PreviousReading = reading.reading.PreviousReading
            }).ToList();

            return reports;
        }

        public async Task<MeterReading> GenerateReadingAsync(Meter meter)
        {
            try
            {
                var newReading = new MeterReading();
                var batch = await _meterReadingBatchService.AddAsync(new MeterReadingBatch());

                if (batch != null)
                {
                    var reading = new MeterReading();
                    var recentMeterReading = await _rawMeterReadingService.GetLastReadingFromMeter($"{meter.Tenant.Gateway}/{meter.Tenant.UnitId}");
                    var previousReading = await GetPreviousReadingAsync(meter);
                    var currentReading = recentMeterReading != null ? recentMeterReading.Kilowatthour : 0;
                    var currentConsumption = previousReading != null ? currentReading - previousReading.CurrentReading : 0;
                    var previousConsumption = previousReading != null ? previousReading.CurrentConsumption : 0;

                    reading.MeterReadingBatchId = batch.Id;
                    reading.MeterId = meter.Id;
                    reading.TenantId = meter.TenantId;
                    reading.CurrentConsumption = currentConsumption;
                    reading.PreviousConsumption = previousConsumption;
                    reading.PreviousReading = previousReading != null ? previousReading.CurrentReading : 0;
                    reading.CurrentReading = currentReading;
                    reading.PercentageDifference = previousConsumption > 0 ? (currentConsumption - previousConsumption) / previousConsumption : 0;
                    reading.Multi = 1;

                    reading = await AddAsync(reading);
                }

                return newReading;
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        public async Task<List<MeterReading>> GenerateReadingsAsync(List<Meter> meters)
        {
            var readings = new List<MeterReading>();

            foreach (var meter in meters)
            {
                readings.Add(await GenerateReadingAsync(meter));
            }

            return readings;
        }

        public async Task<MeterReading> GetAsync(Expression<Func<MeterReading, bool>> expression) => await _dbContext.MeterReadings.SingleOrDefaultAsync(expression);

        public async Task<MeterReading?> GetPreviousReadingAsync(Meter meter)
        {
            var list = await _dbContext.MeterReadings.Where(reading => reading.MeterId.Equals(meter.Id)).OrderBy(reading => reading.Id).ToListAsync();

            return list.Count > 0 ? list.Last() : null;
        }

        public async Task<List<MeterReading>> ListAsync(Expression<Func<MeterReading, bool>> expression) => await _dbContext.MeterReadings.Where(expression).ToListAsync();

        public async Task<bool> UpdateAsync(MeterReading entity)
        {
            try
            {
                var existingData = await _dbContext.MeterReadings.SingleOrDefaultAsync(result => result.Id.Equals(entity.Id));

                if (existingData == null) return false;

                existingData.TenantId = entity.TenantId;
                existingData.MeterId = entity.MeterId;

                _dbContext.MeterReadings.Update(existingData);

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