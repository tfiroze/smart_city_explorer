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

    console.log(command, '-------------------')
    // execute Python script and get the result
    const result = execSync(command, { encoding: 'utf8' });

    return result.trim();
  } catch (err) {
    console.error('ERROR:', err.message);
    return null;
  }
}

let getRecommendVenues = (req, res, next) => {
<<<<<<< HEAD
  console.log(req.body.zoneGroup, req.body.attractions);
=======
>>>>>>> 13e9eac33c186a8ea56f489b5dfefd6fc53609ae

  const ipynbFileName = '../data_models/Recommendation_model/recommendation_model.ipynb'
  console.log(ipynbFileName);
  // For example of input: 
  // user_zone_input = ["Upper_West_Side", "Upper_East_Side"]
  // user_input_attractions = ["Neighborhood_Market", "Shopping_Center"]

  const user_zone_input = req.body.zoneGroup
  const user_input_attractions = req.body.attractions

  const parameters = [user_zone_input, user_input_attractions]

  // get a string from python script and convert into json
  const result = executeIPythonNotebook(ipynbFileName, parameters);
<<<<<<< HEAD
  const str_res = result.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')
  console.log(str_res)
  let json_res = JSON.parse(str_res)


  const venueIds = [];

  for (const venueType in json_res) {
    // console.log(json_res[venueType])
    const venueTypeData = json_res[venueType];
  
    for (const venueInfo of venueTypeData) {
      console.log(venueInfo, 'VenueIndo');
      const venueId = venueInfo[0];
      venueIds.push(venueId);
=======
  const resString = result.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']')
  let resJSON = JSON.parse(resString)
  
  let venueInfo = {}
  let venueIds = []  
  for (let i=0;i<resJSON.length;i++) {
    venueInfo[resJSON[i]['type']] = []
    for(let j=0;j<3;j++){
      venueIds.push(resJSON[i]['values'][j][0])
      venueInfo[resJSON[i]['type']].push(
        {
          venue_id: resJSON[i]['values'][j][0],
          rating: resJSON[i]['values'][j][1],
          busyness: resJSON[i]['values'][j][2],
          score: resJSON[i]['values'][j][3]
        }
      )
>>>>>>> 13e9eac33c186a8ea56f489b5dfefd6fc53609ae
    }
  }

  try {
    let dbOperation = (conn) => {
      const sqlStr = 'select original_ven_id,name,rating,image,description,type_mod,latitude,longitude from venue_static where original_ven_id in (?)'
      conn.query(sqlStr, [venueIds], (err, result) => {
        if(err) {
            console.error(err)
            conn.end()
            return res.status(200).send({valid:false,message:'Failed to get recommendation venues'})
        }
      }).then(([rows]) => {
        for (const key in venueInfo) {
          for(let i=0;i<venueInfo[key].length;i++){
            for(let j=0;j<rows.length;j++){
              if(rows[j]['original_ven_id'] === venueInfo[key][i]['venue_id']){
                venueInfo[key][i]['name'] = rows[j]['name']
                venueInfo[key][i]['image'] = rows[j]['image']
                venueInfo[key][i]['latitude'] = rows[j]['latitude']
                venueInfo[key][i]['longitude'] = rows[j]['longitude']
                venueInfo[key][i]['description'] = rows[j]['description']
              }
            }
          } 
        }       
        conn.end()
<<<<<<< HEAD
        return res.status(200).send({valid:true,data:categorizedData})
=======
        return res.status(200).send({valid:true, data:venueInfo})
>>>>>>> 13e9eac33c186a8ea56f489b5dfefd6fc53609ae
      })
    }
    createSSHTunnel(dbOperation)
  }catch(err) {
    console.error(err)
    conn.end()
    return res.stauts(200).send({valid:false, message:'Failed to get recommendation venues'})
  }
}


// let checkVenueOpen = (req, res) => {
//   let day = new Date(req.body.date).getDay()
//   let venueIds = []

//   for (const venue of req.body.result) {
//     venueIds.push(venue.original_ven_id)
//   }

//   try {
//     let dbOperation = (conn) => {
//       const sqlStr = 'select venue_id from venue_timings where venue_id in (?) and day=? and (opening_time=-1 or opening_time=0)'
//       conn.query(sqlStr, [venueIds, day], (err, result) => {
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
  getRecommendVenues
  // checkVenueOpen
}