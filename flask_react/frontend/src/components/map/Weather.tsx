//@ts-nocheck
import React, { useState } from "react";
import {
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import axios from "axios";

const WeatherForecast = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Store the selected date
  const [weatherData, setWeatherData] = useState(null); // Store the weather data
  const [places, setPlaces] = useState([]); // Store the nearby places data

  const OPENMETEO_API_KEY: string = process.env.REACT_APP_RAPIDAPI_KEY || "";
  const OPENMETEO_API_URL = "https://api.open-meteo.com/v1/forecast";
  const GOOGLE_PLACES_API_KEY = "GOOGLE_PLACES_API_KEY"; // moet vervang

  const getWeatherForecast = async (date: Date) => {
    try {
      const dateString = date.toISOString().slice(0, 10); // Format the selected date as "YYYY-MM-DD"
      const response = await axios.get(OPENMETEO_API_KEY, {
        params: {
          latitude: SELECTED_LATITUDE, // Replace with the desired latitude
          longitude: SELECTED_LONGITUDE, // Replace with the desired longitude
          daily: "temperature_2m_1h_min,temperature_2m_1h_max,precipitation_hours",
          start: dateString,
          end: dateString,
          timezone: "YOUR_TIMEZONE", // Replace with the desired timezone
          key: OPENMETEO_API_KEY,
        },
      });

      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather forecast", error);
    }
  };

  const getNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000, // Search within a 5km radius (adjust as needed)
            key: GOOGLE_PLACES_API_KEY,
          },
        }
      );

      setPlaces(response.data.results);
    } catch (error) {
      console.error("Error fetching nearby places", error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleGetForecast = () => {
    if (selectedDate) {
      getWeatherForecast(selectedDate);
      getNearbyPlaces(SELECTED_LATITUDE, SELECTED_LONGITUDE); // Replace with the desired latitude and longitude
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleGetForecast}>
          Get Forecast and Nearby Places
        </Button>
      </Grid>
      {weatherData && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Forecast for {selectedDate?.toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Min Temperature: {weatherData.daily.temperature_2m_1h_min}°C
              </Typography>
              <Typography variant="body1">
                Max Temperature: {weatherData.daily.temperature_2m_1h_max}°C
              </Typography>
              <Typography variant="body1">
                Precipitation Hours: {weatherData.daily.precipitation_hours}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
      {places.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nearby Places
              </Typography>
              {places.map((place) => (
                <Typography key={place.place_id} variant="body1">
                  {place.name}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      )}
      {selectedDate && (
        <Grid item xs={12}>
          <Card>
            <CardMedia
              component="img"
              alt="Weather Map"
              height="300"
              image={`https://www.meteosource.com/api/v1/flexi/map?key=METEOSOURCE_API_KEY&tile_x=0&tile_y=0&tile_zoom=6&datetime=${selectedDate.toISOString()}&variable=temperature`}
            />
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default WeatherForecast;
