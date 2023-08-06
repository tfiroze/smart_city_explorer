import React from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import manhattan_zones from "../../temp/manhattan_zones.geojson";
import { scaleQuantile } from "d3-scale";

const colorScale = scaleQuantile()
	// .domain([minVenueCount, maxVenueCount])
	.range(["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"]);

function getColor(d) {
	return colorScale(d);
}

function style(feature) {
	return {
		fillColor: getColor(feature.properties.objectid),
		weight: 2,
		opacity: 1,
		color: "white",
		fillOpacity: 0.7,
	};
}

function Choropleth() {
	return (
		<MapContainer center={[40.7831, -73.9712]} zoom={13}>
			<GeoJSON data={manhattan_zones} style={style} />
		</MapContainer>
	);
}

export default Choropleth;
