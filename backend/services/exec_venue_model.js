const { json } = require('body-parser');
const { execSync } = require('child_process');
const createSSHTunnel = require('../db')
const path = require('path');
const os = require('os');
function executeIPythonNotebook(ipynbFileName, parameters) {
  try {
    
    // 1. turn .ipynb into .py script
    // execSync(`/home/student/.local/bin/jupyter-nbconvert --to script ${fileName}`);
    try {
      // Use backticks for command string to avoid escaping issues
      execSync(`jupyter-nbconvert --to script "${ipynbFileName}"`);
      console.log('Conversion successful');
  } catch (error) {
      console.error('Error during conversion:', error.message);
  }

    // 2. get the name of .py file
    const scriptFileName = ipynbFileName.replace('.ipynb', '.py');
    
    // create the command about executing
    let command;
    if (os.platform() === 'win32') {
      // On Windows, use 'python' instead of '/usr/bin/python3'
      command = `python "${scriptFileName}" ${parameters.join(' ')}`;
    } else {
      // On Unix-like systems, use '/usr/bin/python3'
      command = `/usr/bin/python3 "${scriptFileName}" ${parameters.join(' ')}`;
    }

    console.log('Executing command:', command);
    // execute Python script and get the result
    const result = execSync(command, { encoding: 'utf8' });

    return result.trim();
  } catch (err) {
    console.error('ERROR:', err.message);
    return null;
  }
}

let getAttractionInfo = (req, res, next) => {
  // const ipynbFileName = '../data_models/Recommendation_model/recommendation_model.ipynb'
  // const ipynbFileName = '../data_models/Recommendation_model/recommendation_model.ipynb'
  // console.log(ipynbFileName);
  // For example of input: 
  // user_zone_input = ["Upper_West_Side", "Upper_East_Side"]
  // user_input_attractions = ["Neighborhood_Market", "Shopping_Center"]

  const user_zone_input = req.body.zoneGroup
  const user_input_attractions = req.body.attractions
  const user_input_restaurants = req.body.restaurants

  const parameters = [user_zone_input, user_input_attractions, user_input_restaurants]

  
  const baseDir = path.resolve(__dirname, '..');
  const ipynbFileName = path.join(baseDir, 'data_models', 'Recommendation_model', 'recommendation_model.ipynb');
  
  // Resolve to absolute path
  const absolutePath = path.resolve(ipynbFileName);
  
  console.log('Attempting to convert file:', absolutePath);

  // get a string from python script and convert into json
  const result = executeIPythonNotebook(absolutePath, parameters);
  const resString = result.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')
  const resArray = resString.split('|')
  const resRest = resArray[0]
  const resVen = resArray[1]

  let resRestJSON = JSON.parse(resRest)
  let resVenJSON = JSON.parse(resVen)

  const attractionOrder = resVenJSON.map(item => ({
    order: item.order,
    type: item.type
  }))
  const restOrder = resRestJSON.map(item => ({
    order: item.order,
    type: item.type
  }))
  

  let attractionInfo = {}
  let attractionIds = []  
  for (let i=0;i<resVenJSON.length;i++) {
    attractionInfo[resVenJSON[i]['type']] = []
    for(let j=0;j<resVenJSON[i]['values'].length;j++){
      attractionIds.push(resVenJSON[i]['values'][j][0])
      attractionInfo[resVenJSON[i]['type']].push(
        {
          venue_id: resVenJSON[i]['values'][j][0],
          rating: resVenJSON[i]['values'][j][1],
          busyness: resVenJSON[i]['values'][j][2],
          score: resVenJSON[i]['values'][j][3]
        }
      )
    }
  }

  let restInfo = {}
  let restIds = []  
  for (let i=0;i<resRestJSON.length;i++) {
    restInfo[resRestJSON[i]['type']] = []
    for(let j=0;j<resRestJSON[i]['values'].length;j++){
      restIds.push(resRestJSON[i]['values'][j][0])
      restInfo[resRestJSON[i]['type']].push(
        {
          venue_id: resRestJSON[i]['values'][j][0],
          rating: resRestJSON[i]['values'][j][1],
          busyness: resRestJSON[i]['values'][j][2],
          score: resRestJSON[i]['values'][j][3]
        }
      )
    }
  }

  try {
    let dbOperation = async (connection) => {
      let conn = await connection.getConnection()
      const sqlStr = 'select original_ven_id,name,rating,image,description,latitude,longitude from venue_static where original_ven_id in (?)'
      conn.query(sqlStr, [attractionIds], (err, result) => {
        if(err) {
            console.error(err)
            conn.end()
            return res.status(200).send({valid:false,message:'Failed to get recommendation venues'})
        }
      }).then(([rows]) => {
        for (const key in attractionInfo) {
          for(let i=0;i<attractionInfo[key].length;i++){
            for(let j=0;j<rows.length;j++){
              if(rows[j]['original_ven_id'] === attractionInfo[key][i]['venue_id']){
                attractionInfo[key][i]['name'] = rows[j]['name']
                attractionInfo[key][i]['image'] = rows[j]['image']
                attractionInfo[key][i]['latitude'] = rows[j]['latitude']
                attractionInfo[key][i]['longitude'] = rows[j]['longitude']
                attractionInfo[key][i]['description'] = rows[j]['description']
              }
            }
          } 
        }       
        conn.release()
        // execute the next middleware
        req.body.attractionInfo = attractionInfo
        req.body.attractionIds = attractionIds
        req.body.attractionOrder = attractionOrder
        req.body.restInfo = restInfo
        req.body.restIds = restIds
        req.body.restOrder = restOrder
        next()
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err) {
    console.error(err)
    conn.release()
    return res.stauts(200).send({valid:false, message:'Failed to get recommendation venues'})
  }
}



let getRestInfo = (req, res) => {
  try{
    let dbOperation = async (connection) => {
      let conn = await connection.getConnection()
      const sqlStr = 'select original_ven_id,name,rating,image,description,latitude,longitude from venue_static where original_ven_id in (?)'
      conn.query(sqlStr, [req.body.restIds], (err, result) => {
        if(err) {
            console.error(err)
            conn.end()
            return res.status(200).send({valid:false,message:'Failed to get recommendation venues'})
        }
      }).then(([rows]) => {
        for (const key in req.body.restInfo) {
          for(let i=0;i<req.body.restInfo[key].length;i++){
            for(let j=0;j<rows.length;j++){
              if(rows[j]['original_ven_id'] === req.body.restInfo[key][i]['venue_id']){
                req.body.restInfo[key][i]['name'] = rows[j]['name']
                req.body.restInfo[key][i]['image'] = rows[j]['image']
                req.body.restInfo[key][i]['latitude'] = rows[j]['latitude']
                req.body.restInfo[key][i]['longitude'] = rows[j]['longitude']
                req.body.restInfo[key][i]['description'] = rows[j]['description']
              }
            }
          } 
        }       
        conn.release()

        return res.status(200).send({valid:true, attractions:req.body.attractionInfo, restaurants:req.body.restInfo, attraction_order: req.body.attractionOrder, restaurant_order:req.body.restOrder})
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err) {
    console.error(err)
    return res.status(200).send({valid:false, message:'Failed to get recommendation venues'})
  }
}


// let checkVenueOpen = (req, res) => {
//   let day = new Date(req.body.date).getDay()
//   let attractionIds = []

//   for (const venue of req.body.result) {
//     attractionIds.push(venue.original_ven_id)
//   }

//   try {
//     let dbOperation = (conn) => {
//       const sqlStr = 'select venue_id from venue_timings where venue_id in (?) and day=? and (opening_time=-1 or opening_time=0)'
//       conn.query(sqlStr, [attractionIds, day], (err, result) => {
//         if(err) {
//             console.error(err)
//             conn.end()
//             return res.status(200).send({valid:false,message:'Failed to get recommendation venues'})
//         }
//       }).then(([rows]) => {
//         for(let i=0;i<rows.length;i++){
//           for(let j=0;j<req.body.result.length;j++){
//             if(rows[i]['venue_id'] === req.body.result[j]['original_ven_id']){
//               req.body.result.splice(j, 1)
//             }
//           }
//         }
//         conn.end()

//       })
//     }
//     createSSHTunnel(dbOperation)
//   }catch(err) {
//     console.error(err)
//     conn.end()
//     return res.stauts(200).send({valid:false, message:'Failed to get recommendation venues'})
//   }
// }

module.exports = {
  getAttractionInfo,
  getRestInfo
  // checkVenueOpen
}
