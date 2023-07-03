import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

interface IProps {
    selected:any
}

export const TaxiMap:React.FC<IProps> = ({selected}) => {
	const center = useMemo(() => ({ lat: 40.7758125, lng: -73.9748125 }), []);
	return (
		<>
			<GoogleMap
				zoom={10}
				center={center}
				mapContainerClassName="startLocationContainer"
			></GoogleMap>
		</>
	);
}