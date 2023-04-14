using AutoMapper;
using cubemeter_api.Base;
using cubemeter_api.DTOs.Gateway.V1;
using cubemeter_api.DTOs.Meter;
using cubemeter_api.DTOs.Meter.Outgoing;
using cubemeter_api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace cubemeter_api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/gateway")]
    public class GatewayVersionOneController : ControllerBase
    {
        private readonly IMeterService _meterService;
        private readonly IPlaceService _placeService;
        private readonly ITenantService _tenantService;
        private readonly IMapper _mapper;
        public GatewayVersionOneController(IMeterService meterService, IPlaceService placeService, ITenantService tenantService, IMapper mapper)
        {
            _placeService = placeService;
            _tenantService = tenantService;
            _meterService = meterService;
            _mapper = mapper;
        }

        [HttpGet("meters/registered")]
        [SwaggerOperation(Summary = "retrieves registered Meters.", Description = "Returns the list of all registered Meters with its Tenant information for each item.")]
        [ProducesResponseType(typeof(GetMetersWithTenantResponse), 200)]
        [ProducesResponseType(typeof(BaseResponse), 400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<GetMetersWithTenantResponse>> GetMetersRegistered()
        {
            var data = await _meterService.ListWithTenantAsync();

            var response = new GetMetersWithTenantResponse
            {
                Message = data.Count > 0 ? data.Count > 1 ? $"{data.Count} Meters found." : $"{data.Count} Meter found." : $"No Meter found.",
                Data = _mapper.Map<List<MeterDto>>(data).OrderBy(e => e.Id).ToList()
            };

            return Ok(response);
        }
    }
}