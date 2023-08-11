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
let getVenueIds = (req, res, next) => {
    let venueDetail = {}
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
                venueDetail = {
                    trip_id: rows[0]['trip_id'],
                    name: rows[0]['trip_name'],
                    owner_id: rows[0]['trip_owner'],
                    date: rows[0]['trip_date'].toISOString().split('T')[0],
                    ven_1:{venue_id:rows[0]['trip_ven_1']},
                    ven_2:{venue_id:rows[0]['trip_ven_2']},
                    ven_3:{venue_id:rows[0]['trip_ven_3']},
                    ven_4:{venue_id:rows[0]['trip_ven_4']},
                    rest_1:{venue_id:rows[0]['trip_rest_1']},
                    rest_2:{venue_id:rows[0]['trip_rest_2']}
                }
                const venueIds = [venueDetail['ven_1']['venue_id'], venueDetail['ven_2']['venue_id'], venueDetail['ven_3']['venue_id'], venueDetail['ven_4']['venue_id'], venueDetail['rest_1']['venue_id'], venueDetail['rest_2']['venue_id']]

                req.body.venueDetail = venueDetail
                req.body.venueIds = venueIds
                
                conn.end()
                next()
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to get trip info'})
    }
}

let getVenueInfo = (req, res, next) => {
    let venueDetail = req.body.venueDetail
    let venueIds = req.body.venueIds
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'select original_ven_id,name,image,rating,description from venue_static where original_ven_id in (?)'
            conn.query(sqlStr, [venueIds], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'There is an error',error:err.message})
                }
            }).then((rows) => {
                let places = rows[0]
                const currentDate = venueDetail['date']

                // the url should be the ip address of server
                const apiUrl = 'http://127.0.0.1:5000/api/busyness';
                const promises = [];

                for (let i = 0; i < places.length; i++) {
                const promise = axios.post(apiUrl, {
                    venue_id: places[i].original_ven_id,
                    date: currentDate,
                    hour: 14
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
                    for(let i=0;i<places.length;i++){
                        if(places[i]['original_ven_id'] == venueDetail['ven_1']['venue_id']){
                            venueDetail['ven_1']['venue_name'] = places[i]['name']
                            venueDetail['ven_1']['image'] = places[i]['image']
                            venueDetail['ven_1']['rating'] = places[i]['rating']
                            venueDetail['ven_1']['description'] = places[i]['description']
                            venueDetail['ven_1']['busyness'] = places[i]['busyness']
                        }else if(places[i]['original_ven_id'] == venueDetail['ven_2']['venue_id']){
                            venueDetail['ven_2']['venue_name'] = places[i]['name']
                            venueDetail['ven_2']['image'] = places[i]['image']
                            venueDetail['ven_2']['rating'] = places[i]['rating']
                            venueDetail['ven_2']['description'] = places[i]['description']
                            venueDetail['ven_2']['busyness'] = places[i]['busyness']
                        }else if(places[i]['original_ven_id'] == venueDetail['ven_3']['venue_id']){
                            venueDetail['ven_3']['venue_name'] = places[i]['name']
                            venueDetail['ven_3']['image'] = places[i]['image']
                            venueDetail['ven_3']['rating'] = places[i]['rating']
                            venueDetail['ven_3']['description'] = places[i]['description']
                            venueDetail['ven_3']['busyness'] = places[i]['busyness']
                        }else if(places[i]['original_ven_id'] == venueDetail['ven_4']['venue_id']){
                            venueDetail['ven_4']['venue_name'] = places[i]['name']
                            venueDetail['ven_4']['image'] = places[i]['image']
                            venueDetail['ven_4']['rating'] = places[i]['rating']
                            venueDetail['ven_4']['description'] = places[i]['description']
                            venueDetail['ven_4']['busyness'] = places[i]['busyness']
                        }else if(places[i]['original_ven_id'] == venueDetail['rest_1']['venue_id']){
                            venueDetail['rest_1']['venue_name'] = places[i]['name']
                            venueDetail['rest_1']['image'] = places[i]['image']
                            venueDetail['rest_1']['rating'] = places[i]['rating']
                            venueDetail['rest_1']['description'] = places[i]['description']
                            venueDetail['rest_1']['busyness'] = places[i]['busyness']
                        }else if(places[i]['original_ven_id'] == venueDetail['rest_2']['venue_id']){
                            venueDetail['rest_2']['venue_name'] = places[i]['name']
                            venueDetail['rest_2']['image'] = places[i]['image']
                            venueDetail['rest_2']['rating'] = places[i]['rating']
                            venueDetail['rest_2']['description'] = places[i]['description']
                            venueDetail['rest_2']['busyness'] = places[i]['busyness']
                        }
                    }
                    conn.end();
                    req.body.venueDetail = venueDetail
                    next()
                })
                .catch(error => {
                    console.error('Error:', error);
                    conn.end();
                    return res.status(500).send({valid:false, message:'Internal Server Error',error:error.message});
                })
            })
        }
        createSSHTunnel(dbOperation)
    }catch (err) {
        console.error(err)
        return res.status(200).send({valid:false, message: "There is an error", error: err.message})
    }
}

let getUserIds = (req, res, next) => {
    let venueDetail = req.body.venueDetail
    try {
        let dbOperation = (conn) => {
            const sqlStr = 'select trip_owner_id, requested_user_id from trip_requests where trip_owner_id=?'
            conn.query(sqlStr, [venueDetail['owner_id']], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'There is an error',error:err.message})
                }
            }).then((rows) => {
                if(rows[0].length == 0){
                    venueDetail['friend_id'] = []
                    venueDetail['friend_email'] = []
                }else {
                    const requestedUserIds = [...rows[0].map(item => item.requested_user_id)]
                    venueDetail['friend_id'] = requestedUserIds
                    venueDetail['friend_email'] = []
                }
                req.body.venueDetail = venueDetail
                conn.end()
                next()
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid:200, message:"There is an error", error: err.message})
    }
}

let getUserInfo = (req, res) => {
    venueDetail = req.body.venueDetail
    const userIds = venueDetail['friend_id']
    userIds.push(parseInt(venueDetail['owner_id']))
    try{
        let dbOperation = (conn) => {
            sqlStr = 'select user_id,email from user_info where user_id in (?)'
            conn.query(sqlStr, [userIds], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false,message:'There is an error',error:err.message})
                }
            }).then((rows) => {
                rows[0].sort((a, b) => a.user_id - b.user_id)
                venueDetail['friend_id'].sort((a,b) => a - b)
                for(let i=0;i<rows[0].length;i++){
                    if(rows[0][i]['user_id'] == venueDetail['owner_id']){
                        venueDetail['owner_email'] = rows[0][i]['email']
                        venueDetail['friend_id'].splice(i, 1)
                        rows[0].splice(i, 1)
                    }
                }
                for(let i=0;i<rows[0].length;i++) {
                    venueDetail['friend_email'].push(rows[0][i]['email'])
                }
                conn.end()
                return res.status(200).send({valid:true, data:venueDetail})
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid:false, message:"There is an error", error:err.message})
    }
}

// update trip content (Required: trip_id, trip_name, trip_owner, trip_date, trip_status, [trip_part_1, trip_part_2, trip_part_3, trip_part_4], trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2)
let updateTrip = (req, res) => {
    try{
        let dbOperation = (conn) => {
            const sqlStr = `update trip_info set trip_id=?, trip_name=?, trip_owner=?, trip_date=?, trip_status=?, trip_ven_1=?, trip_ven_2=?, trip_ven_3=?, trip_ven_4=?, trip_rest_1=?, trip_rest_2=? WHERE trip_id=?`
            conn.query(sqlStr, [req.body.trip_name, req.body.user_id, req.body.date, req.body.ven_1, req.body.ven_2, req.body.ven_3, req.body.ven_4, req.body.rest_1, req.body.rest_2], (err, result) => {
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
let addTrip = (req, res, next) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'insert into trip_info (trip_name, trip_owner, trip_date, trip_ven_1, trip_ven_2, trip_ven_3, trip_ven_4, trip_rest_1, trip_rest_2) values (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            conn.query(sqlStr, [req.body.trip_name, req.body.user_id, req.body.date, req.body.ven_1, req.body.ven_2, req.body.ven_3, req.body.ven_4, req.body.rest_1, req.body.rest_2], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid: false, message: 'Failed to add new trip'})
                }
            }).then(([rows]) => {
                if(rows.affectedRows === 1){
                    conn.end()
                    next()
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

let returnTripId = (req, res) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'select trip_id from trip_info  where trip_name=? and trip_owner=? and trip_date=? and trip_ven_1=? and trip_ven_2=? and trip_ven_3=? and trip_ven_4=? and trip_rest_1=? and trip_rest_2=?'
            conn.query(sqlStr, [req.body.trip_name, req.body.user_id, req.body.date, req.body.ven_1, req.body.ven_2, req.body.ven_3, req.body.ven_4, req.body.rest_1, req.body.rest_2 ], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid: false, message: 'Failed to add new trip'})
                }
            }).then(([rows]) => {
                conn.end()
                return res.status(200).send({valid: true, data: rows[0]})
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
let popularPlaces = (req, res, next) => {
    try {
        let dbOperation = (conn) => {
            sqlStr = 'select original_ven_id,name,image,rating,description from venue_static where name="Central Park" or name="Times Square" or name="Empire State Building" or name="The Metropolitan Museum of Art"or name = "Chelsea Market"'
            conn.query(sqlStr, [], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false, message:'Failed to get 5 popular places'})
                }
            }).then(([rows]) => {
                let places = rows
                const currentTime = new Date()
                const currentDate = currentTime.toISOString().slice(0,10)
                const currentHour = currentTime.getHours()

                // the url should be the ip address of server
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
                    req.body.places = places
                    conn.end();
                    next()
                })
                .catch(error => {
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

// add opening_time and closing time in req.body
let businessHour = (req, res) => {
    try {
        const ids = []
        for (let i=0;i<req.body.places.length;i++) {
            ids.push(req.body.places[i]['original_ven_id'])
        }
        let dbOperation = (conn) => {
            sqlStr = 'select distinct venue_id,opening_time,closing_time from venue_timings where venue_id in (?) and day=?'
            conn.query(sqlStr, [ids, new Date().getDay()], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.end()
                    return res.status(200).send({valid:false, message:'Failed to get 5 popular places'})
                }
            }).then((rows)=>{
                let result = req.body.places
                for (let i=0;i<result.length;i++) {
                    rows[0].forEach(row => {
                        if(row['venue_id'] == result[i]['original_ven_id']){
                            result[i]['opening_time'] = row['opening_time']
                            result[i]['closing_time'] = row['closing_time']
                        }
                    });
                }
                conn.end()
                return res.status(200).send(result)
            })
        }
        createSSHTunnel(dbOperation)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid:false, message:'Failed to get 5 popular places'})
    }
}

module.exports = {
    upcomingTripsInfo,
    completedTripsInfo,
    getVenueIds,
    updateTrip,
    addTrip,
    deleteTrip,
    getTripInfoQuestionnaire,
    getTripInfoQuestionnaireMW2,
    getTripInfoQuestionnaireMW,
    popularPlaces,
    businessHour,
    returnTripId,
    getVenueInfo,
    getUserIds,
    getUserInfo
}