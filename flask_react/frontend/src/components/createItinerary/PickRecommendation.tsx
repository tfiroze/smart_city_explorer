import {
    Grid, Typography, Paper, Checkbox, Divider, Alert, styled,
    Fade, Zoom, Slide
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
import 'leaflet-routing-machine';
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import zoneData from "../../temp/zone_Grouping.json";
// import HeatmapLayer from "react-leaflet-heatmap-layer";
import { geojson } from "../../components/map/manhattan.geojson";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { useSpring, animated } from 'react-spring';

function toSentenceCase(str: string): string {
    return str.replace(/[a-z]/i, function (letter: string) {
        return letter.toUpperCase();
    }).trim();
}


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
    textTransform: "capitalize",
}));



interface PickRecommendationProps {

}

export const PickRecommendation: React.FC<PickRecommendationProps> = () => {
    const [thingsTodo, setThingsTodo] = useState<any[]>([]);
    const [shoppingTodo, setShoppingTodo] = useState<any[]>([]);
    const [resturantTodo, setResturantTodo] = useState<any[]>([]);
    const [selectedThingsTodoMarker, setSelectedThingsTodoMarker] = useState<number | null>(null);
    const [selectedShoppingTodoMarker, setSelectedShoppingTodoMarker] = useState<number | null>(null);
    const [selectedResturantTodoMarker, setSelectedResturantTodoMarker] = useState<number | null>(null);

    const markerStyle = useSpring({
        to: {
            transform: 'scale(1)',
            backgroundColor: '#0077be'
        },
        from: {
            transform: 'scale(0)',
            backgroundColor: '#0077be'
        },
        config: { mass: 5, tension: 2000, friction: 200 }
    });

    const selectedMarkerStyle = useSpring({
        to: {
            transform: 'scale(1.5)',
            backgroundColor: '#d50000'
        },
        from: {
            transform: 'scale(0)',
            backgroundColor: '#d50000'
        },
        config: { mass: 5, tension: 2000, friction: 200 }
    });

    // const markerStyle = useSpring({
    //     from: { transform: 'scale(0)' },
    //     to: { transform: 'scale(1)' },
    // });

    // useEffect(() => {
    //     setThingsTodo(zoneData.filter(item => item.zone_group === maxZone));
    //     setShoppingTodo(zoneData.filter(item => item.zone_group === maxZone));
    //     setResturantTodo(zoneData.filter(item => item.zone_group === maxZone));
    // }, [maxZone]);
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
                                        <StyledVenueName>{toSentenceCase(item.venue_name)}</StyledVenueName>

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
                                            // layers={heatmapLayer}
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
                                                    position={{ lat: item.venue_lat, lng: item.venue_lon }}
                                                    eventHandlers={{
                                                        click: () => {
                                                            setSelectedThingsTodoMarker(index);
                                                        },
                                                    }}
                                                    icon={divIcon({
                                                        className: "custom-icon",
                                                        html: renderToStaticMarkup(
                                                            <animated.span style={index === selectedThingsTodoMarker ? selectedMarkerStyle : markerStyle}>
                                                                <img src={icon} alt="Marker" />
                                                            </animated.span>
                                                        ),
                                                        iconSize: [25, 41],
                                                        iconAnchor: [12, 41]
                                                    })}
                                                >
                                                    <Popup>
                                                        <Fade in={true} timeout={500}>
                                                            <div>
                                                                <Typography variant="h6">{toSentenceCase(item.venue_name)}</Typography>
                                                                <Typography variant="body2">{item.venue_desc}</Typography>
                                                            </div>
                                                        </Fade>
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
                                        <StyledVenueName>{toSentenceCase(item.venue_name)}</StyledVenueName>
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
                                        <StyledVenueName>{toSentenceCase(item.venue_name)}</StyledVenueName>
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
