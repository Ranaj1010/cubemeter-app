using AutoMapper;
using cubemeter_api.DTOs._MeterReading.Incoming;
using cubemeter_api.DTOs._MeterReading.Outgoing;
using cubemeter_api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace cubemeter_api.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly string _name = "Report";
        private readonly string _names = "Reports";
        private readonly IMeterService _meterService;
        private readonly ITenantService _tenantService;
        private readonly IMeterReadingService _meterReadingService;
        private readonly IMapper _mapper;

        public ReportsController(ITenantService tenantService, IMeterService meterService, IMeterReadingService meterReadingService, IMapper mapper)
        {
            _tenantService = tenantService;
            _mapper = mapper;
            _meterReadingService = meterReadingService;
            _meterService = meterService;
        }

        [HttpPost("generate-readings")]
        public async Task<ActionResult<GeneratedMeterReadingReportResponse>> GenerateReadingFromMeters(GeneratedMeterReadingReportRequest payload)
        {
            var meters = await _meterService.ListAsync(e => e.Active);
            var readings = await _meterReadingService.GenerateReadingsAsync(meters);
            var reports = await _meterReadingService.GenerateMeterReadingReportAsync(readings);
            var response = new GeneratedMeterReadingReportResponse
            {
                Message = "Reading generated.",
                Data = reports
            };

            return Ok(response);
        }
    }
}