import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback } from "react";
import { GeolocateControl, Map, Marker, NavigationControl, ViewState } from "react-map-gl";

export const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN ?? ""; // mapbox token for using Map

//#region Common Props
export interface ILatLngProps {
	latitude: number;
	longitude: number;
}

interface IMapCommonProps {
	onChangeViewState: (viewState: ViewState) => void;
	viewState: ViewState;
	height: string;
	width: string;
}
//#endregion

//#region MapInputControl
interface IMapInputControl extends IMapCommonProps {
	onGeolocate?: (event: any) => void;
	onChangeMarkerLocation: (location: ILatLngProps) => void;
	location?: ILatLngProps;
	hasError?: boolean;
}
export const MapInputControl = (props: IMapInputControl) => {
	const { viewState, location, height, width, onChangeViewState, onChangeMarkerLocation } = props;
	const geolocateControlRef = useCallback((ref: any) => {
		if (ref) {
			// Activate as soon as the control is loaded
			ref.trigger();
		}
	}, []);

	return (
		<Map
			{...viewState}
			mapStyle="mapbox://styles/mapbox/streets-v9"
			mapboxAccessToken={MAPBOX_TOKEN}
			onMove={(evt) => {
				onChangeViewState(evt.viewState);
			}}
			onClick={(e) => {
				onChangeMarkerLocation({
					latitude: e.lngLat.lat,
					longitude: e.lngLat.lng,
				});
			}}
			style={{
				width: width,
				height: height,
				borderRadius: 10,
				borderStyle: props.hasError ? "solid" : "none",
				borderColor: props.hasError ? "red" : "transparent",
			}}
			{...viewState}
		>
			{location != null && <Marker latitude={location.latitude} longitude={location.longitude} color="red" />}
			<NavigationControl showCompass showZoom visualizePitch />
			<GeolocateControl showUserLocation showUserHeading ref={geolocateControlRef} />
		</Map>
	);
};

//#endregion

//#region ViewMapControl
interface IMapViewControl extends IMapCommonProps {
	locations: ILatLngProps[];
}

export const MapViewControl = (props: IMapViewControl) => {
	const { locations, height, width, viewState } = props;

	return (
		<Map
			initialViewState={viewState}
			{...viewState}
			mapStyle="mapbox://styles/mapbox/streets-v9"
			mapboxAccessToken={MAPBOX_TOKEN}
			style={{
				width: width,
				height: height,
				borderRadius: 10,
			}}
			{...viewState}
		>
			{locations && locations.map((location) => <Marker key={location.latitude + location.longitude} {...location} color="red" />)}
		</Map>
	);
};

//#endregion
