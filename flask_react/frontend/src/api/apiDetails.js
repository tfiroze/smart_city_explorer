// import axios from "axios"; // library to help make API calls

// const getPlacesData = async () => {
// 	try {
// 		const response = await axios.get();
// 		// request (if successful, code runs)
// 	} catch (error) {}
// };
import axios from "axios";

// const URL =
// 	"https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary"; // change

// const options = {
// 	params: {
// 		// change from static :/
// 		bl_latitude: "11.847676",
// 		tr_latitude: "12.838442",
// 		bl_longitude: "109.095887",
// 		tr_longitude: "109.149359",
// 		// restaurant_tagcategory_standalone: "10591",
// 		// restaurant_tagcategory: "10591",
// 		// limit: "30",
// 		// currency: "USD",
// 		// open_now: "false",
// 		// lunit: "km",
// 		// lang: "en_US",
// 	},
// 	headers: {
// 		"X-RapidAPI-Key": "56ada39b28msh66de501f48b72dcp1aad6ejsnd55b28aaab10",
// 		"X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
// 	},
// };

export const getPlacesData = async (type, sw, ne) => {
	try {
		const {
			data: { data },
		} = await axios.get(
			`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, // dynamic, not only receive restaurants
			{
				params: {
					// change from static :/
					bl_latitude: sw.lat,
					tr_latitude: ne.lat,
					bl_longitude: sw.lng,
					tr_longitude: ne.lng,
					// restaurant_tagcategory_standalone: "10591",
					// restaurant_tagcategory: "10591",
					// limit: "30",
					// currency: "USD",
					// open_now: "false",
					// lunit: "km",
					// lang: "en_US",
				},
				headers: {
					"X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
				},
			}
		);
		// request (if successful, code runs)
		return data;
	} catch (error) {
		console.log(error);
	}
};

export const getWeatherData = async (lat, lng) => {
	try {
		const { data } = await axios.get(
			"https://ai-weather-by-meteosource.p.rapidapi.com/current",
			{
				params: {
					lat: lat,
					lon: lng,
					// timezone: "auto",
					// language: "en",
					// units: "auto",
				},
				headers: {
					"X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
				},
			}
		);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }

// secret code stash wuahaha
import React, { useState } from "react";
import axios from "axios";

// const WeatherForecast = () => {
//   const [selectedDate, setSelectedDate] = useState(""); // Store the selected date
//   const [forecast, setForecast] = useState(null); // Store the forecast data

//   const API_KEY = "YOUR_API_KEY";
//   const API_URL = "https://api.open-meteo.com/v1/forecast";

//   const getWeatherForecast = async () => {
//     try {
//       const response = await axios.get(API_URL, {
//         params: {
//           latitude: YOUR_LATITUDE, // Replace with the desired latitude
//           longitude: YOUR_LONGITUDE, // Replace with the desired longitude
//           daily: "temperature_2m_1h_min,temperature_2m_1h_max,precipitation_hours",
//           start: selectedDate,
//           end: selectedDate,
//           timezone: "YOUR_TIMEZONE", // Replace with the desired timezone
//           key: API_KEY,
//         },
//       });

//       // Extract the forecast for the selected date
//       const forecastData = response.data.daily.find(
//         (item) => item.time === selectedDate
//       );

//       setForecast(forecastData);
//     } catch (error) {
//       console.error("Error fetching weather forecast", error);
//     }
//   };

//   const handleDateChange = (event) => {
//     setSelectedDate(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     getWeatherForecast();
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Select Date:
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={handleDateChange}
//           />
//         </label>
//         <button type="submit">Get Forecast</button>
//       </form>

//       {forecast && (
//         <div>
//           <h2>Weather Forecast for {selectedDate}</h2>
//           <p>Min Temperature: {forecast.temperature_2m_1h_min}°C</p>
//           <p>Max Temperature: {forecast.temperature_2m_1h_max}°C</p>
//           <p>Precipitation Hours: {forecast.precipitation_hours}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeatherForecast;

// // weather map
// <html>
// <head>
//     <title> Meteosource API | Google Maps API Integration </title>
//     <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
//     <style>
//     #map {
//         height: 100%;
//     }

//     html,
//     body {
//         height: 100%;
//         margin: 0;
//         padding: 0;
//     }
//     </style>
//     <script>
//     const METEOSOURCE_API_KEY = "YOUR-API-KEY";

//     function initMap() {
//         let map = new google.maps.Map(document.getElementById("map"), {
//             center: {
//                 lat: 51.5,
//                 lng: 0
//             },
//             zoom: 6,
//         });
//         var rainMapOverlay = new google.maps.ImageMapType({
//             getTileUrl: function(coord, zoom) {
//                 return 'https://www.meteosource.com/api/v1/flexi/map?key=' + METEOSOURCE_API_KEY + '&tile_x=' + coord.x + '&tile_y=' + coord.y + '&tile_zoom=' + zoom + '&datetime=+1hour&variable=temperature'
//             },
//             tileSize: new google.maps.Size(256, 256)
//         });
//         map.overlayMapTypes.insertAt(0, rainMapOverlay)
//     }
//     window.initMap = initMap;
//     </script>
// </head>

// <body>
//     <div id="map"></div>

//     <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap&v=weekly" defer></script>
// </body>

// </html>
