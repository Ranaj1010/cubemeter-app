using System.Text.Json;
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
using MQTTnet;
using MQTTnet.Client;


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


            services.AddSwaggerGen(c =>
            {
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
            services.AddHostedService<MqttClientService>();
            services.AddSingleton<MqttFactory>(s => new MqttFactory());
            services.AddSingleton<IMqttClient>(s => new MqttFactory().CreateMqttClient());
            services.AddTransient<IMqttClientService, MqttClientService>();
            services.AddTransient<ITenantService, TenantService>();
            services.AddTransient<IPlaceService, PlaceService>();
            services.AddTransient<IMeterService, MeterService>();
            services.AddTransient<IRawMeterReadingService, RawMeterReadingService>();
            services.AddTransient<IMeterReadingService, MeterReadingService>();
            services.AddTransient<IMeterReadingBatchService, MeterReadingBatchService>();
        }

        public static void ConfigureCronJobs(this IServiceCollection services)
        {
            // services.AddScheduler(context =>
            // {
            //     var scheduleReadingJob = "ScheduleReadingJob";
            //     context.AddJob(
            //         sp =>
            //         {

            //         }
            //     );
            // });
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
        public static TObject DumpToConsole<TObject>(this TObject @object)
        {
            var output = "NULL";
            if (@object != null)
            {
                output = JsonSerializer.Serialize(@object, new JsonSerializerOptions
                {
                    WriteIndented = true
                });
            }

            Console.WriteLine($"[{@object?.GetType().Name}]:\r\n{output}");
            return @object;
        }
    }
}