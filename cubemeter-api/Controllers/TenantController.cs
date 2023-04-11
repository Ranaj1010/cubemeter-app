using AutoMapper;
using cubemeter_api.DTOs.Tenant;
using cubemeter_api.DTOs.Tenant.Incoming;
using cubemeter_api.DTOs.Tenant.Outgoing;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace cubemeter_api.Controllers
{
    [ApiController]
    [Route("tenant")]
    public class TenantController : ControllerBase
    {
        private readonly string _name = "Tenant";
        private readonly string _names = "Tenants";
        private readonly ITenantService _tenantService;
        private readonly IMapper _mapper;

        public TenantController(ITenantService tenantService, IMapper mapper)
        {
            _tenantService = tenantService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var data = await _tenantService.ListAsync(data => data.Active);

            var response = new GetTenantsResponse
            {
                Message = data.Count > 0 ? $"{data.Count} {(data.Count > 1 ? _name : _names)} found." : $"No {_names} found.",
                Data = _mapper.Map<List<TenantDto>>(data).OrderBy(e => e.Id).ToList()
            };
            return Ok(response);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<GetTenantResponse>> GetById(long id)
        {
            try
            {
                #region Data Validation
                var data = await _tenantService.GetAsync((tenant) => tenant.Id.Equals(id));
                if (data == null) return BadRequest(new GetTenantResponse
                {
                    Message = $"Invalid Request. Unknown {_name}"
                });
                #endregion

                var response = new GetTenantResponse
                {
                    Message = data != null ? $"{_name} found." : $"No {_name} found.",
                    Data = data != null ? _mapper.Map<TenantDto>(data) : null
                };
                return data != null ? Ok(response) : NotFound(response);
            }
            catch (System.Exception ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<AddTenantResponse>> Addtenant(AddTenantRequest request)
        {
            var entity = _mapper.Map<Tenant>(request);
            var created = await _tenantService.AddAsync(entity);
            var dto = _mapper.Map<TenantDto>(created);
            var response = new AddTenantResponse
            {
                Data = dto,
                Message = $"{created.Name} has been created successfully."
            };

            return Ok(response);

        }
        [HttpPut]
        public async Task<ActionResult<UpdateTenantResponse>> Updatetenant(UpdateTenantRequest request)
        {
            #region Data Validation
            var data = await _tenantService.GetAsync((tenant) => tenant.Id.Equals(request.Id));
            if (data == null) return BadRequest(new UpdateTenantResponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var entity = _mapper.Map<Tenant>(request);
            var updated = await _tenantService.UpdateAsync(entity);
            var response = new UpdateTenantResponse
            {
                Data = request,
                Message = updated ? $"{_name} has been successfully updated." : $"Unable to update {_name}. Please try again"
            };

            return updated ? Ok(response) : BadRequest(response);
        }


        [HttpDelete("{id:long}")]
        public async Task<ActionResult<DeleteTenantReponse>> DeleteById(long id)
        {
            #region Data Validation
            var data = await _tenantService.GetAsync((tenant) => tenant.Id.Equals(id));
            if (data == null) return BadRequest(new DeleteTenantReponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion


            var deleted = await _tenantService.DeleteAsync(id);

            var response = new DeleteTenantReponse
            {
                Message = deleted ? $"{_name} has been successfully deleted." : $"Unable to delete {_name}. Please try again"
            };

            return deleted ? Ok(response) : BadRequest(response);
        }
    }
}