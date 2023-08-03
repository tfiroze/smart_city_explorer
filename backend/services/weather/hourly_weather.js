// Weather Forcast Data for next 14 days
// Manhattan information:
  // {
  //   "wmo": "72506",
  //   "name": "Manhattan",
  //   "latitude": "40.7667",
  //   "longitude": "286.033",
  //   "countryCode": "NY"
  // }

const axios = require('axios');
const fs = require('fs');
const path = require('path')

const options = {
  method: 'GET',
  url: 'https://weather-forecast-14-days.p.rapidapi.com/api/getforecastdata',
  params: {
    KEY: '72506',
    LANG: 'en'
  },
  headers: {
    'X-RapidAPI-Key': '58e387c7a8mshe68470ed8957d1ap1c3f54jsn12d9f880117a',
    'X-RapidAPI-Host': 'weather-forecast-14-days.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    const weatherData = response.data;
    console.log(path.join(__dirname, 'weather_forcast.json'))
    const filePath = path.join(__dirname, 'weather_forcast.json');

    // Save the data to a JSON file
    fs.writeFile(filePath, JSON.stringify(weatherData, null, 2), (err) => {
      if (err) {
        console.error('Error saving data to JSON file:', err);
      } else {
        console.log('Data has been saved to weather_data.json');
      }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Call the async function to fetch weather data and save it to JSON
fetchData();