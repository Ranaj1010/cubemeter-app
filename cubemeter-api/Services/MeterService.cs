using System.Linq.Expressions;
using cubemeter_api.Data;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Services
{
    public class MeterService : IMeterService
    {
        private readonly DataContext _dbContext;
        public MeterService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Meter> AddAsync(Meter entity)
        {
            await _dbContext.Meters.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            try
            {
                var existingData = await _dbContext.Meters.SingleOrDefaultAsync(result => result.Id.Equals(id));

                if (existingData == null) return false;

                existingData.Active = false;

                _dbContext.Meters.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        public async Task<Meter> GetAsync(Expression<Func<Meter, bool>> expression) => await _dbContext.Meters.SingleOrDefaultAsync(expression);

        public async Task<List<Meter>> ListAsync(Expression<Func<Meter, bool>> expression) => await _dbContext.Meters.Where(expression).ToListAsync();

        public async Task<List<Meter>> ListWithTenantAsync()
        {
            return await _dbContext.Meters.Where(meter => meter.Active).Join(_dbContext.Tenants, meter => meter.TenantId, tenant => tenant.Id, (meter, tenant) => new Meter
            {
                Id = meter.Id,
                Name = meter.Name,
                MeterType = meter.MeterType,
                MeterUploadType = meter.MeterUploadType,
                Ratio = meter.Ratio,
                SerialNumber = meter.SerialNumber,
                SortNumber = meter.SortNumber,
                TenantId = meter.TenantId,
                Tenant = tenant,
                Active = meter.Active,
                Remarks = meter.Remarks
            }).ToListAsync();
        }

        public async Task<bool> UpdateAsync(Meter entity)
        {
            try
            {
                var existingData = await _dbContext.Meters.SingleOrDefaultAsync(result => result.Id.Equals(entity.Id));

                if (existingData == null) return false;

                existingData.Name = entity.Name;
                existingData.TenantId = entity.TenantId;
                existingData.Remarks = entity.Remarks;
                existingData.SerialNumber = entity.SerialNumber;
                existingData.MeterType = entity.MeterType;
                existingData.MeterUploadType = entity.MeterUploadType;
                existingData.Ratio = entity.Ratio;
                existingData.SortNumber = entity.SortNumber;

                _dbContext.Meters.Update(existingData);

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