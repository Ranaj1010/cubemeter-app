using AutoMapper;
using cubemeter_api.DTOs.Dashboard.Outgoing;
using cubemeter_api.DTOs.Tenant;
using cubemeter_api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace cubemeter_api.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly string _name = "Dashboard";
        private readonly string _names = "Dashboards";
        private readonly IMeterService _meterService;
        private readonly ITenantService _tenantService;
        private readonly IRawMeterReadingService _rawMeterReadingService;
        private readonly IMeterReadingService _meterReadingService;
        private readonly IMqttClientService _mqttClientService;
        private readonly IMapper _mapper;

        public DashboardController(IMeterService placeService, ITenantService tenantService, IMqttClientService mqttClientService, IRawMeterReadingService rawMeterReadingService, IMeterReadingService meterReadingService, IMapper mapper)
        {
            _meterService = placeService;
            _tenantService = tenantService;
            _mqttClientService = mqttClientService;
            _mapper = mapper;
            _meterReadingService = meterReadingService;
            _rawMeterReadingService = rawMeterReadingService;
        }

        [HttpGet("power-consumption")]
        public async Task<ActionResult<PowerConsumptionDashboardResponseDto>> GetTenantsPowerConsumptions()
        {
            var response = new PowerConsumptionDashboardResponseDto();
            var tenants = await _tenantService.ListAsync(tenant => tenant.Active);

            foreach (var tenant in tenants)
            {
                var recentMeterReading = await _rawMeterReadingService.GetLastReadingFromMeter($"{tenant.Gateway}/{tenant.UnitId}");

                if (recentMeterReading != null)
                {

                    response.Data.Add(new TenantPowerConsumptionDto
                    {
                        Tenant = _mapper.Map<TenantDto>(tenant),
                        PowerConsumption = recentMeterReading.Kilowatthour
                    });
                }
                if (recentMeterReading == null)
                {

                    response.Data.Add(new TenantPowerConsumptionDto
                    {
                        Tenant = _mapper.Map<TenantDto>(tenant),
                        PowerConsumption = 0
                    });
                }

            }

            response.Message = "Power Consumption Dashboard generated.";

            return Ok(response);
        }
        [HttpGet("tenant-load")]
        public async Task<ActionResult<LoadDashboardResponseDto>> GetTenantsLoads()
        {
            var response = new LoadDashboardResponseDto();
            var tenants = await _tenantService.ListAsync(tenant => tenant.Active);

            foreach (var tenant in tenants)
            {
                var recentMeterReading = await _rawMeterReadingService.GetLastReadingFromMeter($"{tenant.Gateway}/{tenant.UnitId}");
                if (recentMeterReading != null)
                {
                    response.Data.Add(new TenantLoadDto
                    {
                        Tenant = _mapper.Map<TenantDto>(tenant),
                        Load = recentMeterReading.Kilowatt
                    });
                }

                if (recentMeterReading == null)
                {
                    response.Data.Add(new TenantLoadDto
                    {
                        Tenant = _mapper.Map<TenantDto>(tenant),
                        Load = 0
                    });
                }
            }

            response.Message = "Loads Dashboard generated.";

            return Ok(response);
        }
    }
}