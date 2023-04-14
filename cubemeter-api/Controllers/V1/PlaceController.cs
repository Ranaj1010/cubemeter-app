using AutoMapper;
using cubemeter_api.DTOs.Place;
using cubemeter_api.DTOs.Place.Incoming;
using cubemeter_api.DTOs.Place.Outgoing;
using cubemeter_api.Entities;
using cubemeter_api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using NetTopologySuite;

namespace cubemeter_api.Controllers
{

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/place")]
    public class PlaceController : ControllerBase
    {
        private readonly string _name = "Place";
        private readonly string _names = "Places";
        private readonly IPlaceService _placeService;
        private readonly IMapper _mapper;

        public PlaceController(IPlaceService placeService, IMapper mapper)
        {
            _placeService = placeService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<GetPlacesResponse>> GetAll()
        {
            var data = await _placeService.ListAsync(data => data.Active);

            var response = new GetPlacesResponse
            {
                Message = data.Count > 0 ? data.Count > 1 ? $"{data.Count} {_names} found." : $"{data.Count} {_name} found." : $"No {_name} found.",
                Data = _mapper.Map<List<PlaceDto>>(data).OrderBy(e => e.Id).ToList()
            };
            return Ok(response);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<GetPlacesResponse>> GetById(long id)
        {
            #region Data Validation
            var data = await _placeService.GetAsync((place) => place.Id.Equals(id));
            if (data == null) return BadRequest(new GetPlaceResponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var response = new GetPlaceResponse
            {
                Message = $"{_name} found.",
                Data = _mapper.Map<PlaceDto>(data)
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<AddPlaceResponse>> AddPlace(AddPlaceRequest request)
        {
            var entity = _mapper.Map<Place>(request);
            var created = await _placeService.AddAsync(entity);
            var dto = _mapper.Map<PlaceDto>(created);
            var response = new AddPlaceResponse
            {
                Data = dto,
                Message = $"{created.Name} has been created successfully."
            };

            return Ok(response);
        }
        [HttpPut]
        public async Task<ActionResult<UpdatePlaceRespose>> UpdatePlace(UpdatePlaceRequest request)
        {
            #region Data Validation
            var data = await _placeService.GetAsync((place) => place.Id.Equals(request.Id));
            if (data == null) return BadRequest(new UpdatePlaceRespose
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var entity = _mapper.Map<Place>(request);
            var created = await _placeService.UpdateAsync(entity);
            var response = new UpdatePlaceRespose
            {
                Data = request,
                Message = created ? $"{_name} has been successfully updated." : $"Unable to delete {_name}. Please try again"
            };

            return created ? Ok(response) : BadRequest(response);
        }


        [HttpDelete("{id:long}")]
        public async Task<ActionResult<DeletePlaceResponse>> DeleteById(long id)
        {
            #region Data Validation
            var data = await _placeService.GetAsync((place) => place.Id.Equals(id));
            if (data == null) return BadRequest(new DeletePlaceResponse
            {
                Message = $"Invalid Request. Unknown {_name}"
            });
            #endregion

            var deleted = await _placeService.DeleteAsync(id);

            var response = new DeletePlaceResponse
            {
                Message = deleted ? $"{_name} has been successfully deleted." : $"Unable to update {_name}. Please try again"
            };

            return deleted ? Ok(response) : BadRequest(response);

        }

    }
}