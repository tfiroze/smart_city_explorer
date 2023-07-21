const express = require('express')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const createSSHTunnel = require('./db')

let secretKey = 'This is the smart_city_explorer app'



// Testing Database Connection
let connTest = (req, res) => {
    let dbOperation = (conn) => {
        conn.query('select * from usersInfo where userId=1').then(([rows]) => {
            res.json(rows);
        }).catch((err) => {
            console.error(err);
        })
    }
    createSSHTunnel(dbOperation)
}

let register = (req, res) => {
    let dbOperation = (conn) => {
        let sqlStr = 'insert into usersInfo (firstname, surname, email, password) values (?, ?, ?, ?)'
        conn.query(sqlStr, [req.body.firstname, req.body.surname, req.body.email, md5(req.body.password)], (err, result) => {
            if(err) {
                console.log(err.message)
                return res.status(200).send({valid: false, message: 'Failed to register'})
            }
        }).then(([rows]) => {
            if(rows.affectedRows === 1){
                return res.status(200).send({valid: true, message: 'Succeed to register'})
            }else {
                return res.status(200).send({valid: false, message: 'Failed to register'})
            }
        })
    }
    createSSHTunnel(dbOperation)
}

let login = (req, res) => {
    let dbOperation = (conn) => {
        sqlStr = 'select userId, firstname, surname, email from usersInfo where email=? and password=?'
        conn.query(sqlStr, [req.body.email, md5(req.body.password)], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(200).send({valid: false, message: 'Failed to login'})
            }
        }).then(([rows]) => {
            let tokenStr = jwt.sign({rows}, secretKey, {expiresIn: 7*24*60*60})
            return res.status(200).send({
                message: 'Succeed to login',
                token: tokenStr
            })
        })
    }
    createSSHTunnel(dbOperation)
}

// retrive user information
let userInfo = (req, res) => {
    let token = req.headers['token']
    try {
        let decode = jwt.verify(token, secretKey).rows;
        let dbOperation = (conn) => {
            let sqlStr = 'select userId, firstname, surname, email from usersInfo where userId=?'
            conn.query(sqlStr, [decode[0].userId], (err, result) => {
                if(err) return res.status(200).send(err.message)
            }).then(([rows]) => {
                return res.status(200).send(rows)
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    register,
    login,
    userInfo,
    connTest
}