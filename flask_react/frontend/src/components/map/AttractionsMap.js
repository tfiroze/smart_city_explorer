import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const AttractionsMap = ({ attractionsByZone }) => {
	// Default location is New York
	const defaultPosition = [40.73061, -73.935242];

	return (
		<MapContainer
			center={defaultPosition}
			zoom={12}
			style={{ width: "100%", height: "500px" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{Object.entries(attractionsByZone).map(([zone, attractions]) =>
				attractions.map((attraction) => (
					<Marker
						key={attraction.name}
						position={[attraction.latitude, attraction.longitude]}
					>
						<Popup>
							<h3>{attraction.name}</h3>
							<p>Type: {attraction.venue_type}</p>
							<p>Rating: {attraction.rating}</p>
							<p>Address: {attraction.address}</p>
						</Popup>
					</Marker>
				))
			)}
		</MapContainer>
	);
};

export default AttractionsMap;
