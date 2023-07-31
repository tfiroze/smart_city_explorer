const { execSync } = require('child_process');

function executeIPythonNotebook(ipynbFileName, parameters) {
  try {
    // 1. turn .ipynb into .py script
    execSync(`jupyter nbconvert --to script ${ipynbFileName}`);

    // 2. get the name of .py file
    const scriptFileName = ipynbFileName.replace('.ipynb', '.py');

    // create the command about executing
    const command = `python ${scriptFileName} ${parameters.join(' ')}`;

    // execute Python script and get the result
    const result = execSync(command, { encoding: 'utf8' });

    return result.trim();
  } catch (err) {
    console.error('ERROR:', err.message);
    return null;
  }
}

let getRecommendVenues = (req, res) => {
  const ipynbFileName = 'services/venue_model/recommendation_model.ipynb';

  // user_zone_input:
  //    Upper_Manhattan, Midtown_Manhattan, Upper_West_Side, Upper_East_Side, Lower_Manhattan, Other
  // user_input_attractions: 
  //    Nature_Attractions, Shopping_Center, Tourist_Destination, Cultural_Heritage, Neighborhood_Market, Fashion_Convenience, Library, Scenic_Landmarks, Art, Religious, Park, Gifts_&_Souvenirs
  
  // For example of input: 
  // let user_zone_input = ["Upper_West_Side", "Upper_East_Side"]
  // let user_input_attractions = ["Neighborhood_Market"]

  user_zone_input = req.body.user_zone_input.replace(/'/g, '"'); 
  user_input_attractions = req.body.user_input_attractions.replace(/'/g, '"'); 

  const parameters = [JSON.parse(user_zone_input), JSON.parse(user_input_attractions)];

  // get a string and convert into json
  const result = executeIPythonNotebook(ipynbFileName, parameters);
  const str_res = result.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')
  let json_res = JSON.parse(str_res)
  console.log(json_res)
}

module.exports = {
  getRecommendVenues
}