import React, { useRef, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTrip } from "../../store/trips";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";
import {
	usePlacesAutocomplete,
	getGeocode,
	getLatLng,
	getDetails,
} from "use-places-autocomplete";
import mapStyles from "./MapStyles";
import "@reach/combobox/styles.css";
import "./MapContainer.css";

const selectTrips = (state) => state.trips;

export default function MapContainer() {
	const dispatch = useDispatch();
	const trips = useSelector(selectTrips);
	const trip = trips.trip ? trips.trip : null;
	const center =
		trip && trip.locations && trip.locations.length
			? trip.locations[trip.locations.length - 1]?.coordinates
			: { lat: 40.7128, lng: -74.006 };

	const [selectedMarker, setSelectedMarker] = useState(null);
	const mapRef = useRef();

	const onMapLoad = useCallback((map) => {
		mapRef.current = map;
	}, []);

	const changeCenter = useCallback(({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng });
		mapRef.current.setZoom(12);
	}, []);

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete();

	const handleSelect = async (address) => {
		setValue(address, false);
		clearSuggestions();
		const results = await getGeocode({ address });
		const { lat, lng } = await getLatLng(results[0]);
		changeCenter({ lat, lng });
		const request = {
			placeId: results[0].place_id,
			fields: ["name", "opening_hours", "website", "rating", "photos"],
		};
		const details = await getDetails(request);

		if (details.opening_hours) {
			dispatch(
				updateTrip({
					...trip,
					locations: [
						...trip.locations,
						{
							title: details.name,
							coordinates: { lat, lng },
							hours: details.opening_hours.weekday_text,
							rating: details.rating,
							website: details.website,
							date: "none",
							photo: details.photos[0].getUrl(),
						},
					],
				})
			);
		} else {
			dispatch(
				updateTrip({
					...trip,
					locations: [
						...trip.locations,
						{
							title: details.name,
							coordinates: { lat, lng },
							rating: details.rating,
							website: details.website,
							date: "none",
							photo: details.photos[0].getUrl(),
						},
					],
				})
			);
		}
		setValue("");
	};

	const options = {
		styles: mapStyles,
		disableDefaultUI: true,
		clickableIcons: false,
	};

	return (
		<div className="map">
			<div className="search-bar">
				<Combobox onSelect={handleSelect}>
					<ComboboxInput
						value={value}
						onChange={(e) => setValue(e.target.value)}
						disabled={!ready}
						placeholder="Search a destination"
					/>
					<ComboboxPopover>
						{status === "OK" &&
							data.map(({ place_id, description }) => (
								<ComboboxOption key={place_id} value={description} />
							))}
					</ComboboxPopover>
				</Combobox>
			</div>
			<GoogleMap
				id="map"
				mapContainerStyle={{ width: "100%", height: "100%" }}
				zoom={10}
				center={center}
				options={options}
				onLoad={onMapLoad}
			>
				{trip &&
					trip.locations &&
					trip.locations.map((location, i) => (
						<Marker
							key={i}
							position={location.coordinates}
							onClick={() => setSelectedMarker(location)}
						/>
					))}
				{selectedMarker ? (
					<InfoWindow
						position={selectedMarker.coordinates}
						onCloseClick={() => setSelectedMarker(null)}
					>
						<div>
							<h2>{selectedMarker.title}</h2>
							<p>{selectedMarker.rating}</p>
						</div>
					</InfoWindow>
				) : null}
			</GoogleMap>
		</div>
	);
}
