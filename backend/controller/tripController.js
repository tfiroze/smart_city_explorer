const createSSHTunnel = require('../db')

// get all trip info of one user (Required: user_id)
let tripsInfo = (req, res) => {
    try {
        let dbOperation = (conn) => {
            let sqlStr = 'SELECT * FROM trip_info JOIN trip_user ON trip_info.trip_id=trip_user.trip_id JOIN user_info ON user_info.user_id=trip_user.user_id WHERE user_info.user_id=?'
            conn.query(sqlStr, [req.params.user_id], (err, result) => {
                if(err) return res.status(400).send(err.message)
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

module.exports = {
    tripsInfo,
    tripInfo,
    updateTrip,
    addTrip,
    deleteTrip
}