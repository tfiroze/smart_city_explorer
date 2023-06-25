import React, { useEffect, useMemo, useState } from "react";
import dataSetA from "../../temp/thingstodo_data/json/thingstodo.json";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { CircularProgress } from "@mui/material";
import { PlacesAutoComplete } from "./PlacesAutoComplete";
import { TaxiMap } from "./TaxiMap";

export const UseTaxi = () => {

	const [selected, setSelected] = useState(null)
	const handleSelection = (location:any) =>{
		console.log(location)
		setSelected(location)
	}

	return(<div>
			<PlacesAutoComplete handleSelection={handleSelection}/>
			<TaxiMap selectedPlace={selected} />
		</div>)
	
};



