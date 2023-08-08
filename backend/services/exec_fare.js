// Params need: venue_id, date

const { spawn } = require('child_process');
const path = require('path')
const createSSHTunnel = require('../db');
const { all } = require('axios');
const fs = require('fs')

const pythonScriptPath = path.join(__dirname, '../../', 'data_models', 'trip_fare_prediction.py')
const reqBodyVenueId = ['ven_344c563654744266547349526b6f7733506f68442d65734a496843', 'ven_30365f61684a68514c7730526b6f775a6c6b7a707255624a496843', 'ven_3075502d337278736a3952526b6f775a4a72674a66616c4a496843', 'ven_307063396f374b4b4e6b71526b6f7759564a316c35656e4a496843', 'ven_3039793356676f745a3570526b6f775974496c6d7378524a496843','ven_344c49766b705544393465526b6f77327244307a4159434a496843']
const reqBodyDate = '2023-08-14'


// prepare input data for fare model
let zoneIdArray = [] // 6 items
let venueLocArray = [] // 6 items
let all_trip_distance = [] // 5 items
let all_pickup_zone = [] // 5 items
let all_dropoff_zone = [] // 5 items
let temp = 24
let all_pickup_hour = [11, 13, 15, 17, 19]
let pickup_weekday_num = new Date(reqBodyDate).getDay()

function getVenueInfo() {
  try {
    let dbOperation = (conn) => {
        let sqlStr = 'SELECT original_ven_id, zone_id, latitude, longitude FROM venue_static WHERE original_ven_id IN (?)'
        conn.query(sqlStr, [reqBodyVenueId], (err, result) => {
            if(err) {
                console.log(err.message)
                return res.status(400).send(err.message)
            }
        }).then(([rows]) => {
          // Stores venue info into zoneIdArray and venueLocArray
          for(let i=0; i<reqBodyVenueId.length; i++) {
            rows.forEach((row) => {
              if(row.original_ven_id == reqBodyVenueId[i]) {
                zoneIdArray.push(row.zone_id)
                venueLocArray.push([row.latitude, row.longitude])
              }
            })
          }
          // run functions here
          getDistance()
          getZones()
          getTemp()
        })
    }
    createSSHTunnel(dbOperation)
  } catch (err) {
    console.error(err)
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
  console.log(all_pickup_zone)
  console.log(all_dropoff_zone)
  console.log(all_trip_distance)
}

function getTemp() {
  const filePath = path.join(__dirname, 'weather', 'weather_forcast.json')
  const newDate = reqBodyDate + 'T12:00:00Z'

  fs.readFile(filePath, 'utf8', (err, data) => {
    try {
      const weatherData = JSON.parse(data)
      for (let i=0; i<weatherData['6_hourly_forecast'].length; i++) {
        if(newDate === weatherData['6_hourly_forecast'][i]['FCTTIME']){
          symbolText = weatherData['6_hourly_forecast'][i]['symbol_text']
          temp = weatherData['6_hourly_forecast'][i]['temp']

          // handle symbolText to weathercode


          console.log(symbol, temp)
          break;
        }
      }
    }catch (err) {
      console.error(err)
      return
    }
  })
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

function exec_py() {
  const args = [1, 2];
  const pythonProcess = spawn('python', [pythonScriptPath, ...args]);

  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
  });

  pythonProcess.stderr.on('data', (data) => {
    const error = data.toString();
    console.error('ERROR:', error);
  });
}

getVenueInfo()

// prepareJSON()
// exec_py()