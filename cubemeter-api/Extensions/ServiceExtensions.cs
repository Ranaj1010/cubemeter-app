using AutoMapper;
using cubemeter_api.Configurations;
using cubemeter_api.Data;
using cubemeter_api.DTOs.Place;
using cubemeter_api.Interfaces;
using cubemeter_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace cubemeter_api.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddApiVersioning(setup =>
            {
                setup.DefaultApiVersion = new ApiVersion(1, 0);
                setup.AssumeDefaultVersionWhenUnspecified = true;
                setup.ReportApiVersions = true;
            });

            services.AddVersionedApiExplorer(setup =>
           {
               setup.GroupNameFormat = "'v'VVV";
               setup.SubstituteApiVersionInUrl = true;
           });

        
            services.AddSwaggerGen(c => {
                c.EnableAnnotations();
            });
            services.ConfigureOptions<ConfigureSwaggerOptions>();
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