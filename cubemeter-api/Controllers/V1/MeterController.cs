using AutoMapper;
using cubemeter_api.DTOs._MeterReading.Incoming;
using cubemeter_api.DTOs._MeterReading.Outgoing;
using cubemeter_api.DTOs.Meter;
using cubemeter_api.DTOs.Meter.Incoming;
using cubemeter_api.DTOs.Meter.Outgoing;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace cubemeter_api.Controllers
{

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/meter")]
    public class MeterController : ControllerBase
    {
        private readonly string _name = "Meter";
        private readonly string _names = "Meters";
        private readonly IMeterService _meterService;
        private readonly ITenantService _tenantService;
        private readonly IMeterReadingService _meterReadingService;
        private readonly IMqttClientService _mqttClientService;
        private readonly IMapper _mapper;

        public MeterController(IMeterService placeService, ITenantService tenantService, IMqttClientService mqttClientService, IMeterReadingService meterReadingService, IMapper mapper)
        {
            _meterService = placeService;
            _tenantService = tenantService;
            _mqttClientService = mqttClientService;
            _mapper = mapper;
            _meterReadingService = meterReadingService;
        }

        [HttpGet]
        public async Task<ActionResult<GetMetersResponse>> GetAllMeters()
        {
            var data = await _meterService.ListAsync(data => data.Active);

            var response = new GetMetersResponse
            {
                Message = data.Count > 0 ? data.Count > 1 ? $"{data.Count} {_names} found." : $"{data.Count} {_name} found." : $"No {_name} found.",
                Data = _mapper.Map<List<MeterDto>>(data).OrderBy(e => e.Id).ToList()
            };
            return Ok(response);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<GetMetersResponse>> GetById(long id)
        {
            #region Data Validation
            var data = await _meterService.GetAsync((place) => place.Id.Equals(id));
            if (data == null) return BadRequest(new GetMeterResponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var response = new GetMeterResponse
            {
                Message = $"{_name} found.",
                Data = _mapper.Map<MeterDto>(data)
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<AddMeterResponse>> AddMeter(AddMeterRequest request)
        {
            var entity = _mapper.Map<Meter>(request);
            var created = await _meterService.AddAsync(entity);

            var tenant = await _tenantService.GetAsync(tenant => tenant.Id.Equals(created.TenantId));
            var topic = $"{tenant.Gateway}/{created.Id}";
            var subscribed = await _mqttClientService.SubscribeToTopic(topic);

            var dto = _mapper.Map<MeterDto>(created);
            var response = new AddMeterResponse
            {
                Data = dto,
                Message = $"{created.Name} has been created successfully."
            };

            return Ok(response);
        }
        [HttpPut]
        public async Task<ActionResult<UpdateMeterResponse>> UpdateMeter(UpdateMeterRequest request)
        {
            #region Data Validation
            var data = await _meterService.GetAsync((place) => place.Id.Equals(request.Id));
            if (data == null) return BadRequest(new UpdateMeterResponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var entity = _mapper.Map<Meter>(request);
            var created = await _meterService.UpdateAsync(entity);
            var response = new UpdateMeterResponse
            {
                Data = request,
                Message = created ? $"{_name} has been successfully updated." : $"Unable to delete {_name}. Please try again"
            };

            return created ? Ok(response) : BadRequest(response);
        }


        [HttpDelete("{id:long}")]
        public async Task<ActionResult<DeleteMeterResponse>> DeleteById(long id)
        {
            #region Data Validation
            var data = await _meterService.GetAsync((place) => place.Id.Equals(id));
            if (data == null) return BadRequest(new DeleteMeterResponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var deleted = await _meterService.DeleteAsync(id);

            var response = new DeleteMeterResponse
            {
                Message = deleted ? $"{_name} has been successfully deleted." : $"Unable to update {_name}. Please try again"
            };

            return deleted ? Ok(response) : BadRequest(response);

        }
        [HttpPost("test-topic-connection")]
        public async Task<ActionResult<TestMeterConnectionResponse>> RegisterMeterTopic(TestMeterConnectionRequest payload)
        {

            var success = await _mqttClientService.TestTopicConnection(payload.Topic);

            var response = new
            {
                Message = success ? "Test connection success." : "Test connection failed."
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