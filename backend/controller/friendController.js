const createSSHTunnel = require('../db');

// 1. API to check if an email exists and retrieve its user_id (Required: email)
exports.checkEmail = (req, res, next) => {
  try {
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'SELECT * FROM user_info WHERE email = ?'
      conn.query(sqlStr, [req.body.email], (err, result) => {
        if (err) {
          console.error(err)
          // conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then(([rows]) => {
        if (rows.length > 0) {
          res.status(200).json({ valid: true, message: 'Email exists.', user_id: rows[0].user_id });
          next()
        } else {
          res.status(200).json({ valid: false, message: 'Email not found.' });
        }
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  } catch (err) {
    console.error(err)
    return res.status(200).send({ valid: false, message: 'Something Went Wrong!' })
  }
}

// 2. API to send an invite (Required: user_id, trip_id, trip_owner_id)
exports.sendInvite = async (req, res, next) => {
  
  try {
    let dbOperation = async (connection) => {
      
      let conn = await connection.getConnection()
      
      let sqlStr = 'SELECT * FROM trip_requests WHERE requested_user_id = ? AND trip_id = ?'
      
      conn.query(sqlStr, [req.body.user_id, req.body.trip_id], (err, result) => {
        console.log("query executed", err, result)
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        
        if (rows[0].length > 0) {
          conn.release()
          return res.status(400).json({ valid:false, message: 'Request already sent.' });
        } else {
          conn.release()
          next()
        }
      })
    } 
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)

  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({valid:false, message: 'There was an error.', error: error.message});
  }
}


// return res.status(200).json({valid:true, message: 'Invite sent.' });
exports.addTripRequest = (req, res) => {
  try {
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'INSERT INTO trip_requests (trip_id, trip_owner_id, requested_user_id, confirmation_status) VALUES (?, ?, ?, ?)'
      conn.query(sqlStr, [req.body.trip_id, req.body.trip_owner_id, req.body.user_id, 'awaiting'], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        conn.release()
        return res.status(200).send({valid:true, message: "Invite sent"})
      })
    }    
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err){
    console.error('Error:', error);
    return res.status(500).json({valid:false, message: 'There was an error.', error: error.message});
  }
}


// (Required: user_id)
exports.checkRequests = (req, res, next) => {

  try{
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'SELECT * FROM trip_requests WHERE requested_user_id = ? AND confirmation_status = ?'
      conn.query(sqlStr, [req.body.user_id, 'awaiting'], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        if (rows[0].length > 0) {
          let requests = []
          // Loop over trip requests and fetch additional information
          for (let request of rows[0]) {
            requests.push(request)  
          }
          req.body.requests = requests
          next()
        } else {
          res.status(404).json({valid:false, message: 'No trip requests found.' });
        }
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch (err) {
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}

exports.checkRequestsMW = (req, res, next) => {
  let requests = req.body.requests
  let ids = []
  for(let i=0;i<requests.length;i++){
    ids.push(requests[i]['trip_id'])
  }
  try{
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'SELECT trip_id,trip_name FROM trip_info WHERE trip_id in (?)'
      conn.query(sqlStr, [ids], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        if(rows[0].length > 0){
          for(let i=0;i<rows[0].length;i++){
            for(let j=0;j<requests.length;j++){
              if(rows[0][i]['trip_id'] == requests[j]['trip_id']){
                requests[j]['trip_name'] = rows[0][i]['trip_name']
              }
            }
          }
        }
        req.body.requests = requests
        conn.release()
        next()
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err) {
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}

exports.checkRequestsMW2 = (req, res) => {
  let requests = req.body.requests
  let ids = []
  for(let i=0;i<requests.length;i++){
    ids.push(requests[i]['trip_owner_id'])
  }
  try {
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'SELECT user_id,email,firstname,surname FROM user_info WHERE user_id in (?)'
      conn.query(sqlStr, [ids], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        console.log(rows)
        if(rows[0].length > 0){
          for(let i=0;i<rows[0].length;i++){
            for(let j=0;j<requests.length;j++){
              if(rows[0][i]['user_id'] == requests[j]['trip_owner_id']){
                requests[j]['email'] = rows[0][i]['email']
                requests[j]['firstname'] = rows[0][i]['firstname']
                requests[j]['surname'] = rows[0][i]['surname']
              }
            }
          }
        }
        conn.release()
        return res.status(200).send({valid:true, data: requests})
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err) {
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}

// (Required: trip_id, user_id)
exports.acceptInvite = (req, res, next) => {
  try {
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'UPDATE trip_requests SET confirmation_status = ? WHERE trip_id = ? AND requested_user_id = ?'
      conn.query(sqlStr, ['accepted', req.body.trip_id, req.body.user_id], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        conn.release()
        next()
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err) {
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}

exports.acceptInviteMW = (req, res, next) => {
  try{
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = 'SELECT trip_part_1, trip_part_2, trip_part_3, trip_part_4 FROM trip_info WHERE trip_id = ?'
      conn.query(sqlStr, [req.body.trip_id], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        console.log(rows, 'rows')
        let columnToUpdate
        if (rows[0][0]['trip_part_1'] == 0) {
          columnToUpdate = 'trip_part_1';
        } else if (rows[0]['trip_part_2'] == 0) {
          columnToUpdate = 'trip_part_2';
        } else if (rows[0]['trip_part_3'] == 0) {
          columnToUpdate = 'trip_part_3';
        } else if (rows[0]['trip_part_4'] == 0) {
          columnToUpdate = 'trip_part_4';
        }

        console.log(columnToUpdate)
        req.body.columnToUpdate = columnToUpdate
        conn.release()
        next()
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err){
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}

exports.acceptInviteMW2 = (req, res) => {
  console.log(req.body)
  try {
    let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
      let sqlStr = `UPDATE trip_info SET ${req.body.columnToUpdate}=? WHERE trip_id=?`
      conn.query(sqlStr, [ req.body.user_id, req.body.trip_id], (err, result) => {
        if(err) {
          console.error(err)
          conn.release()
          return res.status(200).send({ valid: false, message: 'There is an error', error:err })
        }
      }).then((rows) => {
        return res.status(200).json({valid:true, message: 'Invite accepted and user added as a trip participant.' });
      })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err){
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}


// (Required: trip_id, user_id)
exports.declineInvite = (req, res) => {
  try {
    let dbOperation = async (connection) => {
    let conn = await connection.getConnection()
    let sqlStr = 'DELETE FROM trip_requests WHERE trip_id = ? AND requested_user_id = ?'
    conn.query(sqlStr, [req.body.trip_id, req.body.user_id], (err, result) => {
      if(err) {
        console.error(err)
        conn.release()
        return res.status(200).send({ valid: false, message: 'There is an error', error:err })
      }
    }).then((rows) => {
      conn.release()
      res.status(200).json({valid:true, message: 'Invite declined.' });
    })
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
  }catch(err) {
    console.error(err)
    return res.status(200).send({valid: false, message:"There is an error", error:err})
  }
}
