//@ts-nocheck
import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

function ItineraryGenerator() {
    const [interests, setInterests] = useState<string[]>([]);
    const [ratingThreshold, setRatingThreshold] = useState(0);
    const [visitTime, setVisitTime] = useState('09:00');
    const [preferLessBusy, setPreferLessBusy] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState<string | null>(null);


    const generateItinerary = async () => {
        // Validate inputs
        if (!Array.isArray(interests) || interests.some(interest => typeof interest !== 'string')) {
            setError('Interests must be a list of strings.');
            return;
        }
        if (typeof ratingThreshold !== 'number' || ratingThreshold < 0 || ratingThreshold > 5) {
            setError('Rating threshold must be a number between 0 and 5.');
            return;
        }

        // Make a request to the backend to generate an itinerary
        try {
            const response = await axios.get('http://localhost:5000/generate_itinerary', {
                params: {
                    interests: interests,
                    rating_threshold: ratingThreshold,
                    visit_time: visitTime,
                    prefer_less_busy: preferLessBusy,
                },
            });

            // Update the itinerary state with the received itinerary
            setItinerary(response.data.itinerary);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to generate itinerary: ${err.message}`);
            } else {
                setError('An unknown error occurred.');
            }
        }

    };

    return (
        <div>
            {/* User inputs for selecting preferences */}
            <h1>Itinerary Generator</h1>
            <input type="text" value={interests} onChange={(e) => setInterests(e.target.value.split(','))} placeholder="Enter interests (comma-separated)" />
            <input type="number" min="0" max="5" value={ratingThreshold} onChange={(e) => setRatingThreshold(Number(e.target.value))} placeholder="Enter rating threshold" />
            <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} />
            <label>
                Prefer less busy venues?
                <input type="checkbox" checked={preferLessBusy} onChange={(e) => setPreferLessBusy(e.target.checked)} />
            </label>
            <button onClick={generateItinerary}>Generate Itinerary</button>

            {/* Error message */}
            {error && <p>{error}</p>}

            {/* Map for displaying the itinerary */}
            {itinerary && (
                <MapContainer center={[itinerary[0].lat, itinerary[0].lon]} zoom={13} style={{ height: "100vh", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {itinerary.map((venue, index) => (
                        <Marker key={index} position={[venue.lat, venue.lon]}>
                            <Popup>
                                <h2>{venue.name}</h2>
                                <p>Rating: {venue.rating}</p>
                            </Popup>
                        </Marker>
                    ))}
                    <Polyline positions={itinerary.map((venue) => [venue.lat, venue.lon])} />
                </MapContainer>
            )}
        </div>
    );
}

export default ItineraryGenerator;
