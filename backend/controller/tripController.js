const createSSHTunnel = require('../db')

// get all trip info of one user (Required: user_id)
let tripsInfo = (req, res) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'SELECT * FROM trip_info JOIN trip_user ON trip_info.trip_id=trip_user.trip_id JOIN user_info ON user_info.user_id=trip_user.user_id WHERE user_info.user_id=?'
            conn.query(sqlStr, [req.params.user_id], (err, result) => {
                if(err) {
                    console.log(err.message)
                    return res.status(400).send(err.message)
                }
            }).then(([rows]) => {
                return res.status(200).send(rows)
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

let getTripInfoQuestionnaire = (req, res) => {
    res_json = {
        'zone_group':['Upper Manhattan','Upper West Side','Upper East Side','Chelsea/Greenwhich market','Lower Manhattan','Midtown Manhattan']
    }
    try {
        let dbOperation = (conn) => {
            const sqlStr = 'select distinct type_mod from venue_static where type_mod is not null'
            conn.query(sqlStr, [], (err, result) => {
                if(err) {
                    console.log(err.message)
                    return res.status(400).send(err.message)
                }
            }).then(([rows]) => {
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

// let getTripInfoQuestionnaire = (req, res) => {
//     try {
//         let dbOperation = (conn) => {
//             const sqlStr1 = 'select distinct type_mod from venue_static where type_mod is not null';
//             const sqlStr2 = 'select distinct zone_group from venue_static where zone_group is not null';

//             // 使用Promise.all()来同时执行多个查询
//             return Promise.all([
//                 new Promise((resolve, reject) => {
//                     conn.query(sqlStr1, [], (err, result) => {
//                         if (err) {
//                             console.log(err.message);
//                             reject(err);
//                         } else {
//                             resolve(result);
//                         }
//                     });
//                 }),
//                 new Promise((resolve, reject) => {
//                     conn.query(sqlStr2, [], (err, result) => {
//                         if (err) {
//                             console.log(err.message);
//                             reject(err);
//                         } else {
//                             resolve(result);
//                         }
//                     });
//                 })
//             ]).then(([result1, result2]) => {
//                 const typeArray = result1[0].map(item => item.type_mod);
//                 resJSON = { attraction_type: typeArray };

//                 const zoneArray = result2[0].map(item => item.zone_group);
//                 resJSON.zone_group = zoneArray;

//                 console.log(resJSON);
//                 return res.status(200).json(resJSON);
//             }).catch((err) => {
//                 console.log(err);
//                 return res.status(500).send('Internal Server Error');
//             });
//         };

//         createSSHTunnel(dbOperation).then(() => {
//             console.log("All queries are completed and response has been sent.");
//         }).catch((err) => {
//             console.log(err);
//             return res.status(500).send('Internal Server Error');
//         });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).send('Internal Server Error');
//     }
// };



module.exports = {
    tripsInfo,
    tripInfo,
    updateTrip,
    addTrip,
    deleteTrip,
    getTripInfoQuestionnaire
}