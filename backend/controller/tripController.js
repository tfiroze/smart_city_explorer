const createSSHTunnel = require('../db')
const jwt = require('jsonwebtoken')
const qs = require('qs')
const axios = require('axios')

let secretKey = 'This is the smart_city_explorer app'

// get all upcoming trip info of one user (Required: user_id)
let upcomingTripsInfo = (req, res, next) => {
    try {
        let dbOperation = (conn) => {
            // let sqlStr = 'SELECT * FROM trip_info JOIN trip_user ON trip_info.trip_id=trip_user.trip_id JOIN user_info ON user_info.user_id=trip_user.user_id WHERE user_info.user_id=?'
            let sqlStr = 'select * from trip_info where trip_owner = ? and trip_date > now()'
            conn.query(sqlStr, [req.params.user_id], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'Failed to get trips information'})
                }
            }).then(([rows]) => {
                req.res_json = {'upcomingTrips': rows}
                next()
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.error(err)
        return res.status(200).send({valid: false, message:'Failed to get trip info'})
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
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'Failed to get trips information'})
                }
            }).then(([rows]) => {
                req.res_json.completedTrips = rows
                conn.end()
                return res.status(200).send(req.res_json)
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.error(err)
        return res.status(200).send({valid: false, message:'Failed to get trip info'})
    }
}

// get one trip content (Required: trip_id)
let tripInfo = (req, res) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'select * from trip_info where trip_id=?'
            conn.query(sqlStr, [req.params.trip_id], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'Failed to get trip information'})
                }
            }).then(([rows]) => {
                conn.end()
                return res.status(200).json(rows[0])
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to get trip info'})
    }
}

// update trip content (Required: trip_id, trip_name, trip_owner, trip_date, trip_status, [trip_part_1, trip_part_2, trip_part_3, trip_part_4], trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2)
let updateTrip = (req, res) => {
    try{
        let dbOperation = (conn) => {
            const sqlStr = `update trip_info set trip_id=?, trip_name=?, trip_owner=?, trip_date=?, trip_status=?, trip_part_1=?, trip_part_2=?, trip_part_3=?, trip_part_4=?, trip_ven_1=?, trip_ven_2=?, trip_ven_3=?, trip_ven_4=?, trip_rest_1=?, trip_rest_2=? WHERE trip_id=?`
            conn.query(sqlStr, [req.body.firstname, ], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid: false, message: 'Failed to update trip information'})
                }
            }).then(([rows]) => {
                conn.end()
                return res.status(200).send({valid: true,message: 'Succeed to update trip information'})
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to update trip'})
    }
}

// create new trip (Required: trip_name, trip_owner, trip_date, trip_status, [trip_part_1, trip_part_2, trip_part_3, trip_part_4], trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2) (Return: trip_id)
let addTrip = (req, res) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'insert into trip_info (trip_name, trip_owner, trip_date, trip_status, trip_part_1, trip_part_2, trip_part_3, trip_part_4, trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            conn.query(sqlStr, [req.body.trip_name, ], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid: false, message: 'Failed to add new trip'})
                }
            }).then(([rows]) => {
                if(rows.affectedRows === 1){
                    conn.end()
                    return res.status(200).send({valid: true, message: 'Succeed to add new trip'})
                }else {
                    conn.end()
                    return res.status(200).send({valid: false, message: 'Failed to add new trip'})
                }
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to add new trip'})
    }
}

// delete trip (Required: trip_id)
let deleteTrip = (req, res) => {
    try{
        let dbOperation = (conn) => {
            const sqlStr = `delete from trip_info where trip_id=?`
            conn.query(sqlStr, [req.body.trip_id], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'Failed to delete trip'})
                }}).then(([rows]) => {
                conn.end()
                return res.status(200).send({valid: true,message: 'Succeed to delete trip'})
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to delete trip'})
    }
}

// MiddleWare: get zone_group and execute next controller  (Required: token)
let getTripInfoQuestionnaireMW = (req, res, next) => {
    const token = req.headers['token']
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error(err)
            conn.end()
            return res.status(200).send({valid: false,message: 'Invalid token'})
        } else {
            res_json = {}
            try {
                let dbOperation = (conn) => {
                    const sqlStr = 'select distinct zone_group from venue_static where zone_group is not null'
                    conn.query(sqlStr, [], (err, result) => {
                        if(err) {
                            console.error(err)
                            conn.end()
                            return res.status(200).send({valid:false,message:'Failed to get trip info questionnaire'})
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
                console.error(err)
                conn.end()
                return res.status(200).send({valid:false,message:'Failed to get trip info questionnaire'})
            }
        }
    })
    
}

// Controller: get cusine_type
let getTripInfoQuestionnaireMW2 = (req, res, next) => {
    try {
        let dbOperation = (conn) => {
            const sqlStr = "SELECT DISTINCT type_mod FROM venue_static WHERE type_mod IS NOT NULL AND type_mod LIKE '%Restaurant'";
            conn.query(sqlStr, [], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'Failed to get trip info questionnaire'})
                }
            }).then(([rows]) => {
                const cusineArray = rows.map(item => item.type_mod);
                res_json.cusine_type = cusineArray
                req.res_json = res_json
                next()
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to get trip info questionnaire'})
    }
}


// Controller: get attraction_type
let getTripInfoQuestionnaire = (req, res) => {
    try {
        let dbOperation = (conn) => {
            const sqlStr = "SELECT DISTINCT type_mod FROM venue_static WHERE type_mod IS NOT NULL AND type_mod NOT LIKE '%Restaurant'";
            conn.query(sqlStr, [], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'Failed to get trip info questionnaire'})
                }
            }).then(([rows]) => {
                res_json = req.res_json
                const typeArray = rows.map(item => item.type_mod);
                res_json.attraction_type = typeArray
                conn.end()
                return res.status(200).send(res_json)
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err){
        console.error(err)
        return res.status(200).send({valid:false,message:'Failed to get trip info questionnaire'})
    }
}

// Return five popular places: Central Park, Times Square, Empire State Building, The Metropolitan Museum of Art, Chelsea Market
let popularPlaces = (req, res) => {
    try {
        let dbOperation = (conn) => {
            sqlStr = 'select original_ven_id,name,image,rating,description from venue_static where name="Central Park" or name="Times Square" or name="Empire State Building" or name="The Metropolitan Museum of Art"or name = "Chelsea Market"'
            conn.query(sqlStr, [], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false, message:'Failed to get five popular places'})
                }
            }).then(([rows]) => {
                let places = rows
                const currentTime = new Date()
                const currentDate = currentTime.toISOString().slice(0,10)
                const currentHour = currentTime.getHours()

                // call the busyness api
                // const apiUrl = 'http://127.0.0.1:5000/api/busyness'


                // for(let i=0;i<places.length;i++){
                //     axios.post(apiUrl, { venue_id: places[i].original_ven_id,
                //         date: currentDate,
                //         hour: currentHour })
                //     .then(response => {
                //         places[i].busyness = response.data
                //     })
                //     .catch(error => {
                //         console.error('Error fetching data:', error)
                //     });
                // }


                // conn.end()
                // return res.status(200).send(places)
                const apiUrl = 'http://127.0.0.1:5000/api/busyness';
                const promises = [];

                for (let i = 0; i < places.length; i++) {
                const promise = axios.post(apiUrl, {
                    venue_id: places[i].original_ven_id,
                    date: currentDate,
                    hour: currentHour
                })
                    .then(response => {
                    places[i].busyness = response.data;
                    })
                    .catch(error => {
                    console.error('Error fetching data:', error);
                    });

                promises.push(promise);
                }

                Promise.all(promises)
                .then(() => {
                    conn.end();
                    return res.status(200).send(places);
                })
                .catch(error => {
                    // 处理错误
                    console.error('Error:', error);
                    conn.end();
                    return res.status(500).send('Internal Server Error');
                });

            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid:false, message:'Failed to get five popular places'})
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
    getTripInfoQuestionnaireMW2,
    getTripInfoQuestionnaireMW,
    popularPlaces
}