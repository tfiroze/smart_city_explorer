import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import venueData from "../../temp/dummy_data/venueData.json";
import "./Map.css";

const Map = () => {
	const [onselect, setOnselect] = useState({});

	const highlightFeature = (e) => {
		var layer = e.target;
		const { title, busyness } = e.target.feature.properties;
		setOnselect({
			title,
			busyness,
		});
		layer.setStyle({
			weight: 1,
			color: "black",
			fillOpacity: 1,
		});
	};

	const resetHighlight = (e) => {
		setOnselect({});
		e.target.setStyle(style(e.target.feature));
	};

	const onEachFeature = (feature, layer) => {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
		});
	};

	const mapPolygonColorToBusyness = (busyness) => {
		// We'll add our logic to map busyness level to colors
		// Example:
		return busyness === "High"
			? "#ff0000"
			: busyness === "Medium"
			? "#ffff00"
			: "#00ff00";
	};

	const style = (feature) => {
		return {
			fillColor: mapPolygonColorToBusyness(feature.properties.busyness),
			weight: 1,
			opacity: 1,
			color: "white",
			dashArray: "2",
			fillOpacity: 0.5,
		};
	};

	const mapStyle = {
		height: "55vh",
		width: "85%",
		margin: "0 auto",
	};

	return (
		<div className="container">
			<div className="header">
				<h2 className="heading">Busiest Venues in Manhattan</h2>
				<p className="text-muted">
					A choropleth map displaying the busiest venues in Manhattan. Hover
					over each area for more details.
				</p>
			</div>
			<div className="">
				<div className="">
					{!onselect.title && (
						<div className="census-info-hover">
							<strong>Busiest Venues</strong>
							<p>Hover over each area for more details</p>
						</div>
					)}
					{onselect.title && (
						<ul className="census-info">
							<li>
								<strong>{onselect.title}</strong>
							</li>
							<li>Busyness: {onselect.busyness}</li>
						</ul>
					)}
					<MapContainer
						zoom={12}
						scrollWheelZoom={true}
						style={mapStyle}
						center={[40.7831, -73.9712]}
					>
						<TileLayer
							attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
							url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
						/>
						{venueData && (
							<GeoJSON
								data={venueData}
								style={style}
								onEachFeature={onEachFeature}
							/>
						)}
					</MapContainer>
				</div>
			</div>
		</div>
	);
};

export default Map;
