using AutoMapper;
using cubemeter_api.DTOs.Meter;
using cubemeter_api.DTOs.Place;
using cubemeter_api.DTOs.Place.Incoming;
using cubemeter_api.DTOs.Tenant;
using cubemeter_api.Entities;
using NetTopologySuite;

namespace cubemeter_api.Utilities
{
    public class MappingExtensions : Profile
    {
        public MappingExtensions()
        {
            CreateMap<Place, PlaceDto>().AfterMap((src, dest) =>
            {
                dest.Latitude = src.MapCoordinates.Y;
                dest.Longitude = src.MapCoordinates.X;
            });
            CreateMap<UpdatePlaceRequest, Place>().AfterMap((src, dest) =>
            {
                var geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(4326);
                var location = geometryFactory.CreatePoint(new NetTopologySuite.Geometries.Coordinate(src.Longitude, src.Latitude));
                dest.MapCoordinates = location;
            });
            CreateMap<AddPlaceRequest, Place>().AfterMap((src, dest) =>
            {
                var geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(4326);
                var location = geometryFactory.CreatePoint(new NetTopologySuite.Geometries.Coordinate(src.Longitude, src.Latitude));
                dest.MapCoordinates = location;
            });
            CreateMap<Tenant, TenantDto>().ReverseMap();
            CreateMap<Meter, MeterDto>().ReverseMap();
        }
    }
}