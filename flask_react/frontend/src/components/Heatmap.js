import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // this syntax ensures that mapbox-gl gets bundled
import "mapbox-gl/dist/mapbox-gl.css";
import data from "../temp/zone_Grouping.json";
mapboxgl.accessToken =
	"pk.eyJ1IjoidGVlZG9nIiwiYSI6ImNsa2xnb2VkYzBnb2wzZGw5bGo2NHVkbTQifQ.r6o-Y8rLWCDsiOsXjJyzaA";

const HeatMap = () => {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-73.9712); // Manhattan coordinates
	const [lat, setLat] = useState(40.7831);
	const [zoom, setZoom] = useState(9);

	useEffect(() => {
		if (map.current) return; // initialize map only once

		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: zoom,
		});

		map.current.on("load", () => {
			map.current.addSource("heatmap-source", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: data.map((item) => ({
						type: "Feature",
						properties: {},
						geometry: {
							type: "Point",
							coordinates: [item.longitude, item.latitude],
						},
					})),
				},
			});

			map.current.addLayer({
				id: "heatmap-layer",
				type: "heatmap",
				source: "heatmap-source",
				maxzoom: 15,
				paint: {
					"heatmap-weight": 1,
					"heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1],
					"heatmap-color": [
						"interpolate",
						["linear"],
						["heatmap-density"],
						0,
						"rgba(33,102,172,0)",
						0.2,
						"rgb(103,169,207)",
						0.4,
						"rgb(209,229,240)",
						0.6,
						"rgb(253,219,199)",
						0.8,
						"rgb(239,138,98)",
						1,
						"rgb(178,24,43)",
					],
					"heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 15],
					"heatmap-opacity": 1,
				},
			});
		});
	}, []);

	return (
		<div>
			<div ref={mapContainer} style={{ width: "100%", height: "500px" }} />
		</div>
	);
};

export default HeatMap;
