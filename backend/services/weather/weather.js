// Weather Forcast Data for next 14 days
// Required: selectedDate
// Manhattan information:
  // {
  //   "wmo": "72506",
  //   "name": "Manhattan",
  //   "latitude": "40.7667",
  //   "longitude": "286.033",
  //   "countryCode": "NY"
  // }

const fs = require('fs');
const path = require('path')
const axios = require('axios')

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

const filePath = path.join(__dirname, 'weather_forcast.json')


// Required: selectedDate
const getWeather = (req, res) => {  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      return;
    }
    try {
      const weatherData = JSON.parse(data);

      const modifiedTimestamp = new Date(weatherData.modified);

      const currentDate = new Date();
      const twentyFourHoursAgo = new Date(currentDate);
      twentyFourHoursAgo.setDate(currentDate.getDate() - 1);

      const isModifiedEarlierThan24Hours = modifiedTimestamp < twentyFourHoursAgo;

      if(isModifiedEarlierThan24Hours){
        fetchData()
      }

      const selectedDate = req.body.selectedDate
      const newDate = selectedDate + 'T12:00:00Z'
      let res_w = {}

      for (let i=0; i<weatherData['6_hourly_forecast'].length; i++) {
        if(newDate === weatherData['6_hourly_forecast'][i]['FCTTIME']){
          res_w = {'date': selectedDate}
          res_w.symbol = weatherData['6_hourly_forecast'][i]['symbol']
          res_w.symbol_text = weatherData['6_hourly_forecast'][i]['symbol_text']
          res_w.temp = weatherData['6_hourly_forecast'][i]['temp']
          res_w.wind = weatherData['6_hourly_forecast'][i]['wind']
          res_w.rain_chance = weatherData['6_hourly_forecast'][i]['rain_chance_0.3mm']
          break;
        }
      }
      res.status(200).send(res_w)

    } catch (error) {
      console.error('Error parsing the JSON data:', error);
    }
  });
}

async function fetchData() {
  try {
    const response = await axios.request(options);
    const weatherData = response.data;
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

module.exports = {getWeather}