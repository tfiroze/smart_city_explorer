// @ts-nocheck

import * as React from 'react';
import { useState } from "react";
import Map, { Marker, Popup, ViewState } from "react-map-gl";
import { Room, Star } from "@mui/icons-material";

function MapBox() {
    const [viewport, setViewport] = useState<ViewState>({
        width: "100vw",
        height: "100vh",
        latitude: 40.7831,
        longitude: -73.9712,
        zoom: 10,
    });

    return (
        <div className="MapBox">
            <Map
                {...viewport}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                // onViewportChange={setViewport}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                <Marker latitude={40.7831} longitude={-73.9712} offset={[0, -20]}>
                    <Room style={{ fontSize: viewport.zoom * 2, color: "red" }} />
                </Marker>

                <Popup
                    latitude={40.7831}
                    longitude={-73.9712}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="left"
                >
                    <div className="card">
                        <label>Place</label>
                        <h4 className="place">Manhattan</h4>
                        <label>Review</label>
                        <p>Great place with a lot of attractions.</p>
                        <label>Rating</label>
                        <div className="stars">
                            <Star />
                            <Star />
                            <Star />
                            <Star />
                        </div>
                        <label>Information</label>
                        <span className="username">
                            Created by <b>t-dog</b>
                        </span>
                    </div>
                </Popup>
            </Map>
        </div>
    );
}

export default MapBox;
