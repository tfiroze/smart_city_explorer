const createSSHTunnel = require('../db')
const jwt = require('jsonwebtoken')

let secretKey = 'This is the smart_city_explorer app'

// get all upcoming trip info of one user (Required: user_id)
let upcomingTripsInfo = (req, res, next) => {
    try {
        let dbOperation = (conn) => {
            // let sqlStr = 'SELECT * FROM trip_info JOIN trip_user ON trip_info.trip_id=trip_user.trip_id JOIN user_info ON user_info.user_id=trip_user.user_id WHERE user_info.user_id=?'
            let sqlStr = 'select * from trip_info where trip_owner = ? and trip_date > now()'
            conn.query(sqlStr, [req.params.user_id], (err, result) => {
                if(err) {
                    console.log(err.message)
                    return res.status(400).send(err.message)
                }
            }).then(([rows]) => {
                req.res_json = {'upcomingTrips': rows}
                // return res.status(200).send(rows)
                next()
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.log(err)
    }
}

// get all completed trip info of one user (Required: user_id)
let completedTripsInfo = (req, res) => {
    try {
        let dbOperation = (conn) => {
            // let sqlStr = 'SELECT * FROM trip_info JOIN trip_user ON trip_info.trip_id=trip_user.trip_id JOIN user_info ON user_info.user_id=trip_user.user_id WHERE user_info.user_id=?'
            let sqlStr = 'select * from trip_info where trip_owner = ? and trip_date < now()'
            conn.query(sqlStr, [req.params.user_id], (err, result) => {
                if(err) {
                    console.log(err.message)
                    return res.status(400).send(err.message)
                }
            }).then(([rows]) => {
                req.res_json.completedTrips = rows
                return res.status(200).send(req.res_json)
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.log(err)
    }
}

// get one trip content (Required: trip_id)
let tripInfo = (req, res) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'select * from trip_info where trip_id=?'
            conn.query(sqlStr, [req.params.trip_id], (err, result) => {
                if(err) return res.status(400).send(err.message)
            }).then(([rows]) => {
                console.log(rows[0])
                return res.status(200).json(rows[0])
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.log(err)
    }
}

// update trip content (Required: trip_id, trip_name, trip_owner, trip_date, trip_status, [trip_part_1, trip_part_2, trip_part_3, trip_part_4], trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2)
let updateTrip = (req, res) => {
    let dbOperation = (conn) => {
        const sqlStr = `update trip_info set trip_id=?, trip_name=?, trip_owner=?, trip_date=?, trip_status=?, trip_part_1=?, trip_part_2=?, trip_part_3=?, trip_part_4=?, trip_ven_1=?, trip_ven_2=?, trip_ven_3=?, trip_ven_4=?, trip_rest_1=?, trip_rest_2=? WHERE trip_id=?`
        conn.query(sqlStr, [req.body.firstname, ], (err, result) => {
            if(err) return res.status(400).send(err.message)
            }).then(([rows]) => {
            return res.status(200).send({
                valid: true,
                message: 'Succeed to update user information'
            })
        })
    }
    createSSHTunnel(dbOperation)
}

// create new trip (Required: trip_name, trip_owner, trip_date, trip_status, [trip_part_1, trip_part_2, trip_part_3, trip_part_4], trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2) (Return: trip_id)
let addTrip = (req, res) => {
    let dbOperation = (conn) => {
        let sqlStr = 'insert into trip_info (trip_name, trip_owner, trip_date, trip_status, trip_part_1, trip_part_2, trip_part_3, trip_part_4, trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        conn.query(sqlStr, [req.body.trip_name, ], (err, result) => {
            if(err) {
                console.log(err.message)
                return res.status(400).send({valid: false, message: 'Failed to add new trip'})
            }
        }).then(([rows]) => {
            if(rows.affectedRows === 1){
                return res.status(200).send({valid: true, message: 'Succeed to add new trip'})
            }else {
                return res.status(400).send({valid: false, message: 'Failed to add new trip'})
            }
        })
    }
    createSSHTunnel(dbOperation)
}

// delete trip (Required: trip_id)
let deleteTrip = (req, res) => {
    let dbOperation = (conn) => {
        const sqlStr = `delete from trip_info where trip_id=?`
        conn.query(sqlStr, [req.body.trip_id], (err, result) => {
            if(err) return res.status(400).send(err.message)
            }).then(([rows]) => {
            return res.status(200).send({
                valid: true,
                message: 'Succeed to delete trip'
            })
        })
    }
    createSSHTunnel(dbOperation)
}

// MiddleWare: get zone_group and execute next controller  (Required: token)
let getTripInfoQuestionnaireMW = (req, res, next) => {
    const token = req.headers['token']
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Invalid Token:', err.message);
            return res.status(400).send({
                valid: false,
                message: 'Invalid token, need to login before request for this api'
            })
        } else {
            res_json = {}
            try {
                let dbOperation = (conn) => {
                    const sqlStr = 'select distinct zone_group from venue_static where zone_group is not null'
                    conn.query(sqlStr, [], (err, result) => {
                        if(err) {
                            console.log(err.message)
                            return res.status(400).send(err.message)
                        }
                    }).then(([rows]) => {
                        const zoneArray = rows.map(item => item.zone_group);
                        res_json.zone_group = zoneArray
                        req.res_json = res_json
                        next()
                    })
                }
                createSSHTunnel(dbOperation)
            }catch(err) {
                console.log(err)
            }
        }
    })
    
}

// Controller: get attraction_type
let getTripInfoQuestionnaire = (req, res) => {
    try {
        let dbOperation = (conn) => {
            const sqlStr = 'select distinct type_mod from venue_static where type_mod is not null'
            conn.query(sqlStr, [], (err, result) => {
                if(err) {
                    console.log(err.message)
                    return res.status(400).send(err.message)
                }
            }).then(([rows]) => {
                res_json = req.res_json
                const typeArray = rows.map(item => item.type_mod);
                res_json.attraction_type = typeArray
                return res.status(200).send(res_json)
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    upcomingTripsInfo,
    completedTripsInfo,
    tripInfo,
    updateTrip,
    addTrip,
    deleteTrip,
    getTripInfoQuestionnaire,
    getTripInfoQuestionnaireMW
}