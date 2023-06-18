using AutoMapper;
using cubemeter_api.DTOs._MeterReading.Incoming;
using cubemeter_api.DTOs._MeterReading.Outgoing;
using cubemeter_api.DTOs.Reports;
using cubemeter_api.DTOs.Reports.Outgoing;
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
        private readonly IMeterReadingBatchService _meterReadingBatchService;
        private readonly IMapper _mapper;

        public ReportsController(ITenantService tenantService, IMeterService meterService, IMeterReadingBatchService meterReadingBatchService, IMeterReadingService meterReadingService, IMapper mapper)
        {
            _tenantService = tenantService;
            _mapper = mapper;
            _meterReadingService = meterReadingService;
            _meterService = meterService;
            _meterReadingBatchService = meterReadingBatchService;
        }

        [HttpGet("meter-reading-batches")]
        public async Task<ActionResult<MeterReadingBatchesResponse>> GetReadingBatches()
        {
            var batches = await _meterReadingBatchService.ListAsync(batches => batches.Active);
            var response = new MeterReadingBatchesResponse
            {
                MeterReadingBatches = _mapper.Map<List<MeterReadingBatchDto>>(batches.OrderByDescending(batches => batches.CreatedAt)),
                Message = batches.Count > 0 ? $"{batches.Count} Readings found." : "No readings found."
            };

            return Ok(response);
        }
        [HttpGet("meter-reading-batches/{id:long}")]
        public async Task<ActionResult<MeterReadingBatchResponse>> GetMeterReadingBatch(long id)
        {
            var batch = await _meterReadingBatchService.GetAsync(batch => batch.Active && batch.Id == id);
            var response = new MeterReadingBatchResponse
            {
                Data = _mapper.Map<MeterReadingBatchDto>(batch),
                Message = batch != null ? $"Batch data found." : "No batch data found."
            };

            return Ok(response);
        }
        [HttpGet("meter-reading-batches/readings/{id:long}")]
        public async Task<ActionResult<MeterReadingBatchesResponse>> GetMeterReadingsByBatch(long id)
        {
            var readings = await _meterReadingService.ListAsync(reading => reading.Active && reading.MeterReadingBatchId == id);
            var reports = await _meterReadingService.GenerateMeterReadingReportAsync(readings);
            var response = new GeneratedMeterReadingReportResponse
            {
                Data = reports,
                Message = reports.Count > 0 ? $"{reports.Count} Reading data found." : "No reading data found."
            };

            return Ok(response);
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