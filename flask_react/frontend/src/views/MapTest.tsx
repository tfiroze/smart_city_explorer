import React from "react";
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import manhattanData from "./manhattan.geojson"; // GeoJSON data
import data from "../temp/attr_Grouping.json";
import { Grid, Rating, Typography } from "@mui/material";
import IItinerary from "../models/IItinerary";

interface IProps {
    data: IItinerary | null
}

function ChoroplethMap({ data }: IProps) {
    return (
        <MapContainer
            style={{ height: "100vh", width: "100%" }}
            zoom={13}
            center={[40.7831, -73.9712]}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data?.plan.map((item) => {
                return (
                    //@ts-ignore
                    <Marker position={[item.lat, item.lon]} riseOnHover>
                        <Popup>
                            <Grid container display='flex' spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        {item.title}
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://www.meteosource.com/static/img/ico/weather/${item.weatherCode!.toString()}.svg`}
                                            alt=""
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <img src={item.imgLink} style={{ maxHeight: '300px', maxWidth: '300px' }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        {item.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export default ChoroplethMap;
