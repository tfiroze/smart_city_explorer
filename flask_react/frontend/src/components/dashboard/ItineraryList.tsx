import React from "react";
import { Itinerary } from "./Itinerary";

export const ItineraryList = () => {
  const data = new Array(5).fill(1).map( (_, i) => i+1 )

  return (
		<div style={{overflowY:'scroll',maxHeight:'90vh'}}>
			{data.map((item, index) => {
				return <Itinerary key={index} />;
			})}
		</div>
	);
};
