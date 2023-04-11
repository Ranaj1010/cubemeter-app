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
    [Route("place")]
    public class PlaceController : ControllerBase
    {
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
                Message = $"{data.Count} item/s found.",
                Data = _mapper.Map<List<PlaceDto>>(data).OrderBy(e => e.Id).ToList()
            };
            return Ok(response);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<GetPlacesResponse>> GetById(long id)
        {
            try
            {
                var data = await _placeService.GetAsync((place) => place.Id.Equals(id));

                var response = new GetPlaceResponse
                {
                    Message = $"Data found.",
                    Data = _mapper.Map<PlaceDto>(data)
                };
                return Ok(response);
            }
            catch (System.Exception)
            {

                var response = new GetPlaceResponse
                {
                    Message = $"No data found."
                };
                return NotFound(response);
            }
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
                Message = $"{created.Name} has been created."
            };

            return Ok(response);

        }
        [HttpPut]
        public async Task<ActionResult<UpdatePlaceRespose>> UpdatePlace(UpdatePlaceRequest request)
        {
            var entity = _mapper.Map<Place>(request);
            var created = await _placeService.UpdateAsync(entity);
            var response = new UpdatePlaceRespose
            {
                Data = request,
                Message = created ? "Place has been updated." : "Unable to update Place. Please try again"
            };

            return created ? Ok(response) : BadRequest(response);
        }


        [HttpDelete("{id:long}")]
        public async Task<ActionResult<DeletePlaceResponse>> DeleteById(long id)
        {
            try
            {
                var data = await _placeService.DeleteAsync(id);

                var response = new DeletePlaceResponse
                {
                    Message = $"Place has been successfully deleted.",
                };
                return Ok(response);
            }
            catch (System.Exception e)
            {
                var response = new DeletePlaceResponse
                {
                    Message = $"Failed to delete record. {e.Message} "
                };
                return NotFound(response);
            }
        }

    }
}