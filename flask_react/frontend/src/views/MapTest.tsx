// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import seg from '../resources/Manhattan_Taxi_Zones.json'
// const { MapContainer, TileLayer, GeoJSON, useMap } = require('react-leaflet');



export default function MapTest() {
  const [render, setRednder] = useState(0)
  const setColor = () => {
    return { weight: 1 };
  };
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100vh" }} onClick={() => setRednder(render + 1)}>
        <MapContainer
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            // zIndex: -1,
            top: 0
          }}
          center={[37.5004851, -96.2261503]}
          zoom={4}
          zoomControl={true}
          scrollWheelZoom={true}
        //   dragging={false}
        //   touchZoom={false}
        //   doubleClickZoom={false}
        //   boxZoom={false}
        //   keyboard={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
          <GeoJSON data={seg}
            key={1}
            style={setColor}
            // ref={layerReference}
          />
        </MapContainer>
      </div>
    </>
  );
}


