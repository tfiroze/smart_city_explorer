// Params need: {venue_id, date, hour}

const { spawn } = require('child_process');
const path = require('path')
const createSSHTunnel = require('../db');
const fs = require('fs').promises;

// const req.body.venue_id = 'ven_344c563654744266547349526b6f7733506f68442d65734a496843'
// const req.body.date = '2023-08-15'
// const req.body.hour = '14'


// prepare input data for fare model

let hash_ven_id = 3031
let hour = 14
let weekday = 0
let temperature_2m = 23.8
// let apparent_temperature = temperature_2m + 2.4
let precipitation = 0
let weathercode = 0
// let visibility = 21526
let windspeed_10m = 6

function start(req, res) {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'SELECT hash_ven_id FROM venue_static WHERE original_ven_id=?'
            conn.query(sqlStr, [req.body.venue_id], (err, result) => {
                if(err) {
                    console.log(err.message)
                    conn.end()
                    return res.status(400).send(err.message)
                }
            }).then(([rows]) => {
                hash_ven_id = rows[0]['hash_ven_id']
                pickup_weekday_num = new Date(req.body.date).getDay()
                if(req.body.hour) hour = req.body.hour

                // run functions here
                getWeather(req)

                // // prepare JSON data and execute model
                prepareJSON(res)
                conn.end()
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.error(err)
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
                temperature_2m = weatherData['6_hourly_forecast'][i]['temp']
                precipitation = weatherData['6_hourly_forcast'][i]['rain']
                windspeed_10m = weatherData['6_hourly_forcast'][i]['wind']
                // convert symbolText to weathercode
                let last8 = symbolText.slice(-8);
                weathercode = getWeatherCode(last8)
                break;
            }
        }
        }catch (err) {
            console.error(err)
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


// prepare data
async function prepareJSON(res) {

    for (let i = 0; i < 5; i++) {
        const dataToSend = {
            hash_ven_id: hash_ven_id,
            hour: hour,
            weekday: weekday,
            temperature_2m: temperature_2m,
            apparent_temperature: temperature_2m + 2.4,
            precipitation: precipitation,
            weathercode: weathercode,
            visibility: 21526,
            windspeed_10m: windspeed_10m
        };
        const dataToSendString = JSON.stringify(dataToSend);

        try {
            const result = await exec_py(dataToSendString);
            return res.status(200).send(result)
        } catch (error) {
            console.error('Error from Python:', error);
        }
    }
}

// execute .py file
function exec_py(dataToSendString) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, '../../data_models', 'venue_busyness_prediction.py'), dataToSendString]);
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

let getVenueBusyness = (req, res) => {
    start(req, res)
}

module.exports = {
    getVenueBusyness,
}