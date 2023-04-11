using System.Linq.Expressions;
using cubemeter_api.Data;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Services
{
    public class PlaceService : IPlaceService
    {
        private readonly DataContext _dbContext;
        public PlaceService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Place> AddAsync(Place entity)
        {
            await _dbContext.Places.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            try
            {
                var existingData = await _dbContext.Places.SingleOrDefaultAsync(result => result.Id.Equals(id));

                if (existingData == null) return false;

                existingData.Active = false;

                _dbContext.Places.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        public async Task<Place> GetAsync(Expression<Func<Place, bool>> expression) => await _dbContext.Places.Where(expression).FirstAsync();

        public async Task<List<Place>> ListAsync(Expression<Func<Place, bool>> expression) => await _dbContext.Places.Where(expression).ToListAsync();
    
        public async Task<bool> UpdateAsync(Place entity)
        {
            try
            {
                var existingData = await _dbContext.Places.SingleOrDefaultAsync(result => result.Id.Equals(entity.Id));

                if (existingData == null) return false;

                existingData.Name = entity.Name;
                existingData.Address = entity.Address;
                existingData.BillingDay = entity.BillingDay;
                existingData.City = entity.City;
                existingData.Country = entity.Country;
                existingData.Currency = entity.Currency;
                existingData.Region = entity.Region;
                existingData.SerialNumber = entity.SerialNumber;
                existingData.SortNumber = entity.SortNumber;
                existingData.Timezone = entity.Timezone;

                _dbContext.Places.Update(existingData);

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