using System.Linq.Expressions;
using cubemeter_api.Data;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Services
{
    public class TenantService : ITenantService
    {
        private readonly DataContext _dbContext;

        public TenantService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Tenant> AddAsync(Tenant entity)
        {
            entity.DateRegistered = DateTime.UtcNow;
            await _dbContext.Tenants.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<List<Tenant>> AddRangeAsync(List<Tenant> entities)
        {
            await _dbContext.Tenants.AddRangeAsync(entities);
            await _dbContext.SaveChangesAsync();
            return entities;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            try
            {
                var existingData = await _dbContext.Tenants.SingleOrDefaultAsync(result => result.Id.Equals(id));

                if (existingData == null) return false;

                existingData.Active = false;

                _dbContext.Tenants.Update(existingData);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        public async Task<Tenant> GetAsync(Expression<Func<Tenant, bool>> expression) => await _dbContext.Tenants.Join(_dbContext.Places, tenant => tenant.PlaceId, place => place.Id, (tenant, place) => new Tenant
        {
            Id = tenant.Id,
            Name = tenant.Name,
            UnitId = tenant.UnitId,
            PlaceId = tenant.PlaceId,
            Meters = tenant.Meters,
            DateRegistered = tenant.DateRegistered,
            Gateway = tenant.Gateway,
            Active = tenant.Active,
            Remarks = tenant.Remarks,
            SerialNumber = tenant.SerialNumber,
            Place = place,
        }).SingleOrDefaultAsync(expression);

        public async Task<List<Tenant>> ListAsync(Expression<Func<Tenant, bool>> expression) => await _dbContext.Tenants.Where(expression).Join(_dbContext.Places, tenant => tenant.PlaceId, place => place.Id, (tenant, place) => new Tenant
        {
            Id = tenant.Id,
            Name = tenant.Name,
            UnitId = tenant.UnitId,
            PlaceId = tenant.PlaceId,
            Meters = tenant.Meters,
            DateRegistered = tenant.DateRegistered,
            Gateway = tenant.Gateway,
            Active = tenant.Active,
            Remarks = tenant.Remarks,
            SerialNumber = tenant.SerialNumber,
            Place = place,
        }).ToListAsync();

        public async Task<bool> UpdateAsync(Tenant entity)
        {
            try
            {
                var existingData = await _dbContext.Tenants.SingleOrDefaultAsync(result => result.Id.Equals(entity.Id));

                if (existingData == null) return false;

                existingData.Name = entity.Name;
                existingData.PlaceId = entity.PlaceId;
                existingData.Remarks = entity.Remarks;
                existingData.SerialNumber = entity.SerialNumber;
                existingData.UnitId = entity.UnitId;
                existingData.Gateway = entity.Gateway;

                _dbContext.Tenants.Update(existingData);

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