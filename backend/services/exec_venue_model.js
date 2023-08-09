const { json } = require('body-parser');
const { execSync } = require('child_process');
const createSSHTunnel = require('../db')

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

let getRecommendVenues = (req, res, next) => {

  const ipynbFileName = '../data_models/Recommendation_model/recommendation_model.ipynb'

  // For example of input: 
  // let user_zone_input = ["Upper_West_Side", "Upper_East_Side"]
  // let user_input_attractions = ["Neighborhood_Market", "Shopping_Center"]
  user_zone_input = req.body.zoneGroup.replace(/'/g, '"'); 
  user_input_attractions = req.body.attractions.replace(/'/g, '"'); 

  const parameters = [JSON.parse(user_zone_input), JSON.parse(user_input_attractions)];

  // get a string and convert into json
  const result = executeIPythonNotebook(ipynbFileName, parameters);
  const str_res = result.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')
  let json_res = JSON.parse(str_res)

  const venueIds = [];

  for (const venueType in json_res) {
    const venueTypeData = json_res[venueType];
  
    for (const venueInfo of venueTypeData) {
      const venueId = venueInfo[0];
      venueIds.push(venueId);
    }
  }
  
  try {
    let dbOperation = (conn) => {
      const sqlStr = 'select original_ven_id,name,rating,image,description,type_mod from venue_static where original_ven_id in (?)'
      conn.query(sqlStr, [venueIds], (err, result) => {
        if(err) {
            console.error(err)
            conn.end()
            return res.status(200).send({valid:false,message:'Failed to get recommendation venues'})
        }
      }).then(([rows]) => {
        let result = rows
        for (let i=0;i<result.length;i++) {
          for(let e in json_res) {
            for(let j=0;j<json_res[e].length;j++){
              if(json_res[e][j][0] == result[i]['original_ven_id']){
                result[i]['busyness'] = json_res[e][j][2]
                result[i]['score'] = json_res[e][j][3]
              }
            }
          }
        }
        const categorizedData = {};

        for (const obj of result) {
          const type = obj.type_mod;

          if (!categorizedData[type]) {
            categorizedData[type] = [];
          }

          categorizedData[type].push(obj);
        }

        conn.end()
        return res.status(200).send(categorizedData)
      })
    }
    createSSHTunnel(dbOperation)
  }catch(err) {
    console.error(err)
    conn.end()
    return res.stauts(200).send({valid:false, message:'Failed to get recommendation venues'})
  }
}


let checkVenueOpen = (req, res) => {
  let day = new Date(req.body.date).getDay()
  let venueIds = []

  for (const venue of req.body.result) {
    venueIds.push(venue.original_ven_id)
  }

  try {
    let dbOperation = (conn) => {
      const sqlStr = 'select venue_id from venue_timings where venue_id in (?) and day=? and (opening_time=-1 or opening_time=0)'
      conn.query(sqlStr, [venueIds, day], (err, result) => {
        if(err) {
            console.error(err)
            conn.end()
            return res.status(200).send({valid:false,message:'Failed to get recommendation venues'})
        }
      }).then(([rows]) => {
        for(let i=0;i<rows.length;i++){
          for(let j=0;j<req.body.result.length;j++){
            if(rows[i]['venue_id'] === req.body.result[j]['original_ven_id']){
              req.body.result.splice(j, 1)
            }
          }
        }
        conn.end()

      })
    }
    createSSHTunnel(dbOperation)
  }catch(err) {
    console.error(err)
    conn.end()
    return res.stauts(200).send({valid:false, message:'Failed to get recommendation venues'})
  }
}

module.exports = {
  getRecommendVenues
  // checkVenueOpen
}