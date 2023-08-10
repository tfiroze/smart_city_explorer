// Params need: venue_id, date

const { spawn } = require('child_process');
const path = require('path')
const createSSHTunnel = require('../db');
const fs = require('fs').promises;

// const reqBodyVenueId = ['ven_344c563654744266547349526b6f7733506f68442d65734a496843', 'ven_30365f61684a68514c7730526b6f775a6c6b7a707255624a496843', 'ven_3075502d337278736a3952526b6f775a4a72674a66616c4a496843', 'ven_307063396f374b4b4e6b71526b6f7759564a316c35656e4a496843', 'ven_3039793356676f745a3570526b6f775974496c6d7378524a496843','ven_344c49766b705544393465526b6f77327244307a4159434a496843']
// const reqBodyDate = '2023-08-15'


// prepare input data for fare model
let zoneIdArray = []
let venueLocArray = []

let all_trip_distance = []
let all_pickup_zone = []
let all_dropoff_zone = []
let temp = 24
let all_pickup_hour = [11, 13, 15, 17, 19]
let pickup_weekday_num = 0
let weather_description = 0

let fareArray = []

function start(req, res) {
  try {
    let dbOperation = (conn) => {
        let sqlStr = 'SELECT original_ven_id, zone_id, latitude, longitude FROM venue_static WHERE original_ven_id IN (?)'
        conn.query(sqlStr, [req.body.venue_id], (err, result) => {
            if(err) {
                console.log(err.message)
                return res.status(400).send(err.message)
            }
        }).then(([rows]) => {
          // Stores venue info into zoneIdArray and venueLocArray
          for(let i=0; i<req.body.venue_id.length; i++) {
            rows.forEach((row) => {
              if(row.original_ven_id == req.body.venue_id[i]) {
                zoneIdArray.push(row.zone_id)
                venueLocArray.push([row.latitude, row.longitude])
                pickup_weekday_num = new Date(req.body.date).getDay()
              }
            })
          }
          // run functions here
          getDistance()
          getZones()
          getWeather(req)

          // prepare JSON data and execute model, return res
          prepareJSON(res)
        })
    }
    createSSHTunnel(dbOperation)
  } catch (err) {
    console.error(err)
    return res.status(200).send({valid:false, message:'Failed to get fares'})
  }
}

function getDistance() {
  for(let i=0; i<venueLocArray.length - 1; i++){
    let lat1 = venueLocArray[i][0]
    let lon1 = venueLocArray[i][1]
    let lat2 = venueLocArray[i+1][0]
    let lon2 = venueLocArray[i+1][1]
    all_trip_distance.push(calculateDistance(lat1, lon1, lat2, lon2))
  }
}

function getZones() {
  // get pickup zone
  for(let i=0; i<zoneIdArray.length - 1; i++){
    all_pickup_zone.push(zoneIdArray[i])
  }
  // get dropoff zone
  for(let i=1; i<zoneIdArray.length; i++){
    all_dropoff_zone.push(zoneIdArray[i])
  }

}

function getWeather(req) {
  const filePath = path.join(__dirname, 'weather', 'weather_forcast.json')
  const newDate = req.body.date + 'T12:00:00Z'

  fs.readFile(filePath, 'utf8', (err, data) => {
    try {
      const weatherData = JSON.parse(data)
      for (let i=0; i<weatherData['6_hourly_forecast'].length; i++) {
        if(newDate === weatherData['6_hourly_forecast'][i]['FCTTIME']){
          symbolText = weatherData['6_hourly_forecast'][i]['symbol_text']
          temp = weatherData['6_hourly_forecast'][i]['temp']

          // convert symbolText to weathercode
          let last8 = symbolText.slice(-8);
          weather_description = getWeatherCode(last8)
          break;
        }
      }
    }catch (err) {
      console.error(err)
      return
    }
  })
}

function getWeatherCode(last8) {
  if (last8.includes("rain") || last8.includes("snow") || last8.includes("shower") || last8.includes("sleet") || last8.includes("storm") || last8.includes("drizzle")) {
    return 2;
  } else if (last8.includes("fog") || last8.includes("mist") || last8.includes("haze")) {
    return 3;
  } else if (last8.includes("cloud") || last8.includes("overcast") || last8.includes("wind") || last8.includes("gusty")) {
    return 51;
  } else {
    return 0;
  }
}

// calculate the distance between two venues
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
  
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = earthRadiusKm * c; // kilometers
  return distance;
}

// prepare data
async function prepareJSON(res) {

  for (let i = 0; i < 5; i++) {
    const dataToSend = {
      trip_distance: all_trip_distance[i],
      pickup_zone: all_pickup_zone[i],
      dropoff_zone: all_dropoff_zone[i],
      temp: temp,
      pickup_hour: all_pickup_hour[i],
      pickup_weekday_num: pickup_weekday_num,
      weather_description: weather_description
    };
    const dataToSendString = JSON.stringify(dataToSend);

    try {
      const result = await exec_py(dataToSendString);
      fareArray.push(result);
    } catch (error) {
      console.error('Error from Python:', error);
    }
  }
  for (let i = 0; i < fareArray.length; i++) {
    fareArray[i] = fareArray[i].replace(/\r?\n|\r/g, ''); 
  }
  // return a array 
  return res.status(200).send(fareArray); 
}

// execute .py file
function exec_py(dataToSendString) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [path.join(__dirname, '../../data_models', 'trip_fare_prediction.py'), dataToSendString]);
    let result = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
}

let getFare = (req, res) => {
  // req.body.venue_id = JSON.parse(req.body.venue_id.replace(/'/g, '"'));
  start(req, res)
}

module.exports = {
  getFare
}