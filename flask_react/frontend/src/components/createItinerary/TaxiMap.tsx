import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useMemo, useState } from "react";

interface IProps {
  selectedPlace: any;
}

export const TaxiMap: React.FC<IProps> = ({ selectedPlace }) => {
  const center = useMemo(() => ({ lat: 40.7758125, lng: -73.9748125 }), []);

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="startLocationContainer"
    >
      {selectedPlace && <Marker position={{ lat: -73.9068973, lng: -73.9068973 }} />}
    </GoogleMap>
  );
};
