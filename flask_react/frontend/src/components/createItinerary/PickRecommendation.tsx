import {
    Grid,
    Typography,
    Paper,
    Checkbox,
    Divider,
    Alert,
    styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import thingsTodoDummyData from "../../temp/dummy_data/thingsTodo.json";
import shoppingDummyData from "../../temp/dummy_data/shoppingData.json";
import restaurantDummyData from "../../temp/dummy_data/restaurantData.json";
import { MapContainer, TileLayer, Popup, useMap, Marker } from "react-leaflet";
import { Map, LatLngLiteral, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

function MapUpdater() {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();
    }, [map]);

    return null;
}

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(2),
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
}));

const StyledVenueName = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(18),
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
}));

export const PickRecommendation = () => {
    const [thingsTodo, setThingsTodo] = useState<any[]>([]);
    const [shoppingTodo, setShoppingTodo] = useState<any[]>([]);
    const [resturantTodo, setResturantTodo] = useState<any[]>([]);

    useEffect(() => {
        setThingsTodo([...thingsTodoDummyData]);
        setShoppingTodo([...shoppingDummyData]);
        setResturantTodo([...restaurantDummyData]);
    }, []);

    const selectThingsTodo = (index: number) => {
        let tempData = thingsTodo;
        tempData[index].selected = !tempData[index].selected;
        setThingsTodo([...tempData]);
    };

    const selectShoppingTodo = (index: number) => {
        let tempData = shoppingTodo;
        tempData[index].selected = !tempData[index].selected;
        setShoppingTodo([...tempData]);
    };

    const selectResturantTodo = (index: number) => {
        let tempData = resturantTodo;
        tempData[index].selected = !tempData[index].selected;
        setResturantTodo([...tempData]);
    };

    return (
        <>
            <Grid container spacing={2} rowGap={1} style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <Alert severity="info">Things to do</Alert>
                </Grid>
                {thingsTodo.map((item, index) => {
                    return (
                        <Grid
                            style={{ cursor: "pointer" }}
                            item
                            xs={12}
                            md={3}
                            onClick={() => selectThingsTodo(index)}
                            className="unselectable"
                        >
                            <StyledPaper elevation={item.selected ? 5 : 1}>
                                <Grid container>
                                    <Grid item xs={11}>
                                        <StyledVenueName>{item.venue_name}</StyledVenueName>
                                    </Grid>
                                    <Grid item xs={1} display="flex" justifyContent="flex-end">
                                        <Checkbox checked={item.selected} />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid xs={12} item style={{ height: "300px" }}>
                                        <MapContainer
                                            center={{ lat: item.venue_lat, lng: item.venue_lon }}
                                            zoom={20}
                                            scrollWheelZoom={false}
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {item.lat !== undefined && item.lon !== undefined && (
                                                <Marker
                                                    position={{
                                                        lat: item.venue_lat,
                                                        lng: item.venue_lon,
                                                    }}
                                                >
                                                    <Popup>
                                                        <strong>Directions:</strong>
                                                        <br />
                                                        <span>
                                                            Lat: {item.lat}, Lon: {item.lon}
                                                        </span>
                                                        <br />
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Open in Google Maps
                                                        </a>
                                                    </Popup>
                                                </Marker>
                                            )}
                                            <MapUpdater />
                                        </MapContainer>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                        </Grid>
                    );
                })}
            </Grid>
            <Grid container spacing={2} rowGap={1} style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <Alert severity="info">Restaurants</Alert>
                </Grid>
                {resturantTodo.map((item, index) => {
                    return (
                        <Grid
                            style={{ cursor: "pointer" }}
                            item
                            xs={12}
                            md={3}
                            onClick={() => selectResturantTodo(index)}
                            className="unselectable"
                        >
                            <StyledPaper elevation={item.selected ? 5 : 1}>
                                <Grid container>
                                    <Grid item xs={11}>
                                        <StyledVenueName>{item.venue_name}</StyledVenueName>
                                    </Grid>
                                    <Grid item xs={1} display="flex" justifyContent="flex-end">
                                        <Checkbox checked={item.selected} />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid xs={12} item style={{ height: "300px" }}>
                                        <MapContainer
                                            center={{ lat: item.venue_lat, lng: item.venue_lon }}
                                            zoom={20}
                                            scrollWheelZoom={false}
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {item.lat !== undefined && item.lon !== undefined && (
                                                <Marker
                                                    position={{
                                                        lat: item.venue_lat,
                                                        lng: item.venue_lon,
                                                    }}
                                                >
                                                    <Popup>
                                                        <strong>Directions:</strong>
                                                        <br />
                                                        <span>
                                                            Lat: {item.lat}, Lon: {item.lon}
                                                        </span>
                                                        <br />
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Open in Google Maps
                                                        </a>
                                                    </Popup>
                                                </Marker>
                                            )}
                                            <MapUpdater />
                                        </MapContainer>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                        </Grid>
                    );
                })}
            </Grid>
            <Grid container spacing={2} rowGap={1} style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <Alert severity="info">Shopping</Alert>
                </Grid>
                {shoppingTodo.map((item, index) => {
                    return (
                        <Grid
                            style={{ cursor: "pointer" }}
                            item
                            xs={12}
                            md={3}
                            onClick={() => selectShoppingTodo(index)}
                            className="unselectable"
                        >
                            <StyledPaper elevation={item.selected ? 5 : 1}>
                                <Grid container>
                                    <Grid item xs={11}>
                                        <StyledVenueName>{item.venue_name}</StyledVenueName>
                                    </Grid>
                                    <Grid item xs={1} display="flex" justifyContent="flex-end">
                                        <Checkbox checked={item.selected} />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid xs={12} item style={{ height: "300px" }}>
                                        <MapContainer
                                            center={{ lat: item.venue_lat, lng: item.venue_lon }}
                                            zoom={20}
                                            scrollWheelZoom={false}
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {item.lat !== undefined && item.lon !== undefined && (
                                                <Marker
                                                    position={{
                                                        lat: item.venue_lat,
                                                        lng: item.venue_lon,
                                                    }}
                                                >
                                                    <Popup>
                                                        <strong>Directions:</strong>
                                                        <br />
                                                        <span>
                                                            Lat: {item.lat}, Lon: {item.lon}
                                                        </span>
                                                        <br />
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Open in Google Maps
                                                        </a>
                                                    </Popup>
                                                </Marker>
                                            )}
                                            <MapUpdater />
                                        </MapContainer>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
