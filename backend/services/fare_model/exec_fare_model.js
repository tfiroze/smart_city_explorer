const { execSync } = require('child_process');
const path = require('path')

function executeIPythonNotebook(ipynbFileName, parameters) {
  try {
    execSync(`jupyter nbconvert --to script ${ipynbFileName}`);

    const scriptFileName = ipynbFileName.replace('.ipynb', '.py');

    const command = `python ${scriptFileName} ${parameters.join(' ')}`;

    const result = execSync(command, { encoding: 'utf8' });

    // const deleteCommand = process.platform === 'win32' ? `del ${scriptFileName}` : `rm ${scriptFileName}`;
    // execSync(deleteCommand, { shell: true });

    return result.trim();
  } catch (err) {
    console.error('ERROR:', err.message);
    return null;
  }
}

// pickup_loc and dropoff_loc should be a array with length is 5
// The 

let getFare = (req, res) => {
  const ipynbFileName = 'services/fare_model/fare_distance_model.ipynb';
  
  // For example: 
  // let pickup_loc = [101, 24, 237, 46, 4]
  // let dropoff_loc = [24, 237, 46, 4, 178]

  let pickup_hour = [11, 13, 15, 17, 19]

  const parameters = [pickup_hour, JSON.parse(req.body.pickup_loc), JSON.parse(req.body.dropoff_loc)];

  const result = executeIPythonNotebook(ipynbFileName, parameters);

  const farePattern = /Fare predictions: \[(.*?)\]/;
  const distancePattern = /Distance predictions: \[(.*?)\]/;

  let fareMatch = result.match(farePattern);
  let distanceMatch = result.match(distancePattern);

  let fareArray = fareMatch[1].split(' ').map(Number);
  let filteredFareArray = fareArray.filter(item => item !== 0);

  let distanceArray = distanceMatch[1].split(' ').map(Number);
  let filteredDistanceArray = distanceArray.filter(item => item !== 0);

  let json_res = {
    'fare_prediction' : filteredFareArray,
    'distance_prediction' : filteredDistanceArray
  }

  res.status(200).send(json_res)
}


module.exports = {
  getFare
}