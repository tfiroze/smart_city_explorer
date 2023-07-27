import React from "react";

interface LegendProps {
	zoneCounts: Record<string, number>;
}
function getZoneColor(zone: string): string {
	// Define color mappings based on the zone
	const colorMap: Record<string, string> = {
		"Upper West Side": "red",
		"Midtown Manhattan": "green",
		"Upper East Side": "blue",
		"Chelsea/Greenwich Market": "black",
		"Upper Manhattan": "orange",

	};

	// Return the color based on the zone, or a default color if not found in the mapping
	return colorMap[zone] || "yellow";
}


const Legend: React.FC<LegendProps> = ({ zoneCounts }) => {
	return (
		<div className="legend">
			<h3>Zone Group Legend</h3>
			{Object.keys(zoneCounts).map((zone, index) => (
				<div key={index} className="legend-item">
					<span
						className="legend-color"
						style={{ backgroundColor: getZoneColor(zone) }}
					></span>
					<span className="legend-label">{zone}</span>
					<span className="legend-count">({zoneCounts[zone]})</span>
				</div>
			))}
		</div>
	);
};

export default Legend;
