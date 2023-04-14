using AutoMapper;
using cubemeter_api.DTOs.Meter;
using cubemeter_api.DTOs.Meter.Incoming;
using cubemeter_api.DTOs.Meter.Outgoing;
using cubemeter_api.DTOs.Place;
using cubemeter_api.DTOs.Place.Incoming;
using cubemeter_api.DTOs.Tenant;
using cubemeter_api.DTOs.Tenant.Incoming;
using cubemeter_api.DTOs.Tenant.Outgoing;
using cubemeter_api.Entities;
using NetTopologySuite;

namespace cubemeter_api.Utilities
{
    public class MappingExtensions : Profile
    {
        public MappingExtensions()
        {
            #region Places
            CreateMap<Place, PlaceDto>().AfterMap((src, dest) =>
            {
                dest.Latitude = src.MapCoordinates.Y;
                dest.Longitude = src.MapCoordinates.X;
            });
            CreateMap<PlaceDto, Place>().AfterMap((src, dest) =>
            {
                dest.MapCoordinates.Y = src.Latitude;
                dest.MapCoordinates.X = src.Latitude;
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
            #endregion
            
            #region Tenants
            CreateMap<AddTenantRequest, Tenant>();
            CreateMap<Tenant, AddTenantResponse>();
            CreateMap<Tenant, TenantDto>().ReverseMap();
            #endregion


            #region Meters
            CreateMap<AddMeterRequest, Meter>();
            CreateMap<Meter, AddMeterResponse>();
            CreateMap<UpdateMeterRequest, Meter>();
            CreateMap<Meter, MeterDto>().ReverseMap();
            #endregion
        }
    }
}