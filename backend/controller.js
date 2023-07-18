const express = require('express')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const db = require('./db')

let secretKey = 'This is the smart_city_explorer app'

let indexPage = (req, res) => {
    res.sendFile(__dirname + '/temp_public/index.html')
}

let register = (req, res) => {
    let sqlStr = 'insert into users (firstName, surname, email, password) values (?, ?, ?, ?)'
    db.query(sqlStr, [req.body.firstName, req.body.surname, req.body.email, md5(req.body.password)], (err, result) => {
    if(err) {
        console.log(err.message)
        return res.status(200).send({valid: false, message: 'Failed to register'})
    }
    // determine if the insertion was successful
    if(result.affectedRows === 1) {
        return res.status(200).send({valid: true, message: 'Succeed to register'})
    }
})
}

let login = (req, res) => {
    sqlStr = 'select * from users where email=? and password=?'
    db.query(sqlStr, [req.body.email, md5(req.body.password)], (err, result) => {
        if(err) {
            return res.status(200).send({valid: false, message: 'Failed to login'})
        }
        if(result && result.length > 0){
            let tokenStr = jwt.sign({result}, secretKey, {expiresIn: '300s'})
            return res.status(200).send({
                message: 'Succeed to login',
                token: tokenStr
            })
        }else {
            return res.status(200).send({authentication:false, message:'Failed to login'})
        }
    })
}

// retrive user information
let userInfo = (req, res) => {
    let token = req.headers['token']
    try {
        let decode = jwt.verify(token, secretKey).result;
        console.log(decode)
        // RETRIEVE
        let sqlStr = 'select firstName,surname,email from users where email=?'
        db.query(sqlStr, [decode[0].email], (err, result) => {
            if(err) return res.status(200).send(err.message)
            return res.status(200).send(result)
})
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    indexPage,
    register,
    login,
    userInfo
}