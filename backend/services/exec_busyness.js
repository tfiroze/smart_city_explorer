// Params need: {venue_id, date, hour}

const { spawn } = require('child_process');
const path = require('path')
const createSSHTunnel = require('../db');
const fs = require('fs').promises;
const os = require('os');
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
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            let sqlStr = 'SELECT hash_ven_id FROM venue_static WHERE original_ven_id=?';
            const [rows] = await conn.query(sqlStr, [req.body.venue_id]);

            if (!rows || rows.length === 0) {
                throw new Error("No matching entry found for venue ID.");
            }

            hash_ven_id = rows[0]['hash_ven_id'];
            pickup_weekday_num = new Date(req.body.date).getDay();
            if (req.body.hour) hour = req.body.hour;

            await getWeather(req);
            let result = await prepareJSON(res);
            res.status(200).json({valid:true, result})
            conn.release();
        }

        // await createSSHTunnel(dbOperation);
        await dbOperation(createSSHTunnel);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

async function getWeather(req) {
    const filePath = path.join(__dirname, 'weather', 'weather_forcast.json');
    // const newDate = req.body.date + 'T12:00:00Z';
    const newDate = "2023-08-15"+"T12:00:00Z"
    console.log(req, filePath)
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
        // console.log("Processed Weather Data:");
        // console.log("Symbol Text:", symbolText);
        // console.log("Temperature:", temperature_2m);
        // console.log("Precipitation:", precipitation);
        // console.log("Wind Speed:", windspeed_10m);
        // console.log("Weather Code:", weathercode);

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
        // console.log("JSON Data to Send:", dataToSend);

        const dataToSendString = JSON.stringify(dataToSend).replace(/"/g, '\\"');
        try {
            const result = await exec_py(dataToSendString);
            return result;
        } catch (error) {
            console.error('Error from Python:', error);
        }
    }
}


function exec_py(dataToSendString) {
    return new Promise((resolve, reject) => {
      const baseDir = path.resolve(__dirname, '..');
      let scriptPath = path.join(baseDir, 'data_models', 'venue_busyness_prediction.py');
      
      const pythonCommand = os.platform() === 'win32' ? 'python' : 'python3';
  
      // Check if the file is a notebook and convert if necessary
      if (path.extname(scriptPath) === '.ipynb') {
        try {
          execSync(`jupyter nbconvert --to script "${scriptPath}"`, { stdio: 'inherit' });
          scriptPath = scriptPath.replace('.ipynb', '.py');
          console.log('Conversion successful');
        } catch (error) {
          console.error('Error during conversion:', error.message);
          return reject(new Error(`Notebook conversion failed: ${error.message}`));
        }
      }
  
      // console.log(`Executing Python script: ${scriptPath}`);
      // console.log(`Data being sent: ${dataToSendString}`);
  
      const pythonProcess = spawn(pythonCommand, [scriptPath, dataToSendString], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });
  
      let result = '';
      let errorOutput = '';
  
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
  
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
  
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          // console.log('Python script executed successfully');
          // console.log('Python output:', result.trim());
          resolve(result.trim());
        } else {
          console.error(`Python script exited with code ${code}`);
          console.error(`Error output: ${errorOutput}`);
          reject(new Error(`Python script exited with code ${code}. Error: ${errorOutput}`));
        }
      });
  
      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });
  }

let getVenueBusyness = (req, res) => {
    start(req, res)
    
}

module.exports = {
    getVenueBusyness,
}
