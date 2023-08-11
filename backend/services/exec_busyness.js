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

// ... other imports ...

async function start(req, res) {
    try {
        const dbOperation = async (conn) => {
            let sqlStr = 'SELECT hash_ven_id FROM venue_static WHERE original_ven_id=?';
            const [rows] = await conn.query(sqlStr, [req.body.venue_id]);

            if (!rows || rows.length === 0) {
                throw new Error("No matching entry found for venue ID.");
            }

            hash_ven_id = rows[0]['hash_ven_id'];
            pickup_weekday_num = new Date(req.body.date).getDay();
            if (req.body.hour) hour = req.body.hour;

            await getWeather(req);
            await prepareJSON(res);
            conn.end();
        }

        await createSSHTunnel(dbOperation);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

async function getWeather(req) {
    const filePath = path.join(__dirname, 'weather', 'weather_forcast.json');
    const newDate = req.body.date + 'T12:00:00Z';

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const weatherData = JSON.parse(data);

        const forecast = weatherData['6_hourly_forecast'].find(forecast => forecast['FCTTIME'] === newDate);

        if (!forecast) {
            throw new Error("Weather data not found for the provided date.");
        }

        symbolText = forecast['symbol_text'];
        temperature_2m = forecast['temp'];
        precipitation = forecast['rain'];
        windspeed_10m = forecast['wind'];

        let last8 = symbolText.slice(-8);
        weathercode = getWeatherCode(last8);

        // Logging the processed weather data
        console.log("Processed Weather Data:");
        console.log("Symbol Text:", symbolText);
        console.log("Temperature:", temperature_2m);
        console.log("Precipitation:", precipitation);
        console.log("Wind Speed:", windspeed_10m);
        console.log("Weather Code:", weathercode);

    } catch (err) {
        console.error(err);
        throw err;  // Rethrow to be caught in the parent function
    }
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
            hour: parseInt(hour, 10),  // Convert to integer
            weekday: weekday,
            temperature_2m: parseFloat(temperature_2m),  // Convert to float
            apparent_temperature: parseFloat(temperature_2m) + 2.4,  // Corrected calculation
            precipitation: parseFloat(precipitation),  // Convert to float
            weathercode: weathercode,
            visibility: 21526,
            windspeed_10m: parseFloat(windspeed_10m)  // Convert to float
        };

        // Logging the JSON object structure
        console.log("JSON Data to Send:", dataToSend);

        const dataToSendString = JSON.stringify(dataToSend);
        try {
            const result = await exec_py(dataToSendString);
            return res.status(200).send(result);
        } catch (error) {
            console.error('Error from Python:', error);
        }
    }
}

// execute .py file
function exec_py(dataToSendString) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('/usr/bin/python3', [path.join(__dirname, '../../data_models', 'venue_busyness_prediction.py'), dataToSendString]);
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
