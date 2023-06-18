using System.Linq.Expressions;
using cubemeter_api.Data;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Services
{
    public class MeterReadingBatchService : IMeterReadingBatchService
    {
        private readonly DataContext _dbContext;
        public MeterReadingBatchService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MeterReadingBatch> AddAsync(MeterReadingBatch entity)
        {
            await _dbContext.MeterReadingBatches.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<List<MeterReadingBatch>> AddRangeAsync(List<MeterReadingBatch> entities)
        {
            await _dbContext.MeterReadingBatches.AddRangeAsync(entities);
            await _dbContext.SaveChangesAsync();
            return entities;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            try
            {
                var existingData = await _dbContext.MeterReadingBatches.SingleOrDefaultAsync(result => result.Id.Equals(id));

                if (existingData == null) return false;

                existingData.Active = false;

                _dbContext.MeterReadingBatches.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        public async Task<MeterReadingBatch> GetAsync(Expression<Func<MeterReadingBatch, bool>> expression) => await _dbContext.MeterReadingBatches.SingleOrDefaultAsync(expression);

        public async Task<List<MeterReadingBatch>> ListAsync(Expression<Func<MeterReadingBatch, bool>> expression) => await _dbContext.MeterReadingBatches.Where(expression).ToListAsync();

        public async Task<bool> UpdateAsync(MeterReadingBatch entity)
        {
            try
            {
                var existingData = await _dbContext.MeterReadingBatches.SingleOrDefaultAsync(result => result.Id.Equals(entity.Id));

                if (existingData == null) return false;

                _dbContext.MeterReadingBatches.Update(existingData);

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