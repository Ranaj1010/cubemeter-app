using AutoMapper;
using cubemeter_api.Data;
using cubemeter_api.DTOs.Place;
using cubemeter_api.Interfaces;
using cubemeter_api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace cubemeter_api.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CubeMeter API Documentation", Version = "v1" });
            });
        }

        public static void ConfigureAutomapper(this IServiceCollection services)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        }

        public static void ConfigureDependencyInjection(this IServiceCollection services)
        {
            services.AddTransient<ITenantService, TenantService>();
            services.AddTransient<IPlaceService, PlaceService>();
            services.AddTransient<IMeterService, MeterService>();
        }

        public static void ConfigureDBContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(database => database.UseNpgsql(configuration.GetConnectionString("DefaultConnection"), x => x.UseNetTopologySuite()), ServiceLifetime.Transient, ServiceLifetime.Singleton);
        }

        public static void ConfigureCORS(this IServiceCollection services, IConfiguration configuration, string allowedOrigin)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(allowedOrigin, policy => policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());
            });
        }
    }
}