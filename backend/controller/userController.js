const jwt = require('jsonwebtoken')
const md5 = require('md5')
const createSSHTunnel = require('../db')
const captchaCheck = require('../services/emailVerification')

let secretKey = 'This is the smart_city_explorer app'

// Testing Database Connection
let connTest = (req, res) => {
    const sessionID = req.cookies['sessionID'];
    const captcha = req.session[sessionID].captcha
    console.log(req.session[sessionID])
}

// verify email unique when user register a new account (Required: firstname, surname, email, captcha, password)
let verifyEmailUnique = (req, res, next) => {
    let dbOperation = (conn) => {
        let sqlStr = 'SELECT COUNT(*) as count FROM user_info WHERE email =?'
        conn.query(sqlStr, [req.body.email], (err, result) => {
            if(err) {
                console.error(err)
                return res.status(500).send({
                    valid: false,
                    message: 'Failed to register',
                    err: err.message
                })
            }
        }).then(([rows]) => {
            if(rows[0].count === 0){
                next()
            }else {
                return res.status(200).send({valid: false, message: 'Email has been registered'})
            }
        })
    }
    createSSHTunnel(dbOperation)
}

// Register 
let register = (req, res) => {
    let captchaCheckResult = captchaCheck.verifyCode(req, req.body.captcha)
    console.log(captchaCheckResult)
    if (!captchaCheckResult.isValid) {
        return res.status(401).send({valid: false, message: captchaCheckResult.message})
    }
    let dbOperation = (conn) => {
        let sqlStr = 'insert into user_info (firstname, surname, email, password) values (?, ?, ?, ?)'
        conn.query(sqlStr, [req.body.firstname, req.body.surname, req.body.email, md5(req.body.password)], (err, result) => {
            if(err) {
                console.error(err)
                return res.status(500).send({
                    valid: false, 
                    message: 'Failed to register',
                    err: err.message
                })
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

// Login (Required: email, password)
let login = (req, res) => {
    let dbOperation = (conn) => {
        console.log(req.body);
        sqlStr = 'select user_id, firstname, surname, email from user_info where email=? and password=?'
        conn.query(sqlStr, [req.body.email, md5(req.body.password)], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(500).send({
                    valid: false, 
                    message: 'Failed to login',
                    err: err.message
                })
            }
        }).then(([rows]) => {
            if(rows[0] == undefined) {
                return res.status(200).send({valid:false,message: 'wrong email or password'})
            }
            let user_idStr = rows[0].user_id
            let tokenStr = jwt.sign({user_idStr}, secretKey, {expiresIn: 7*24*60*60})

            const decoded = jwt.decode(tokenStr);

            const expirationTime = new Date(decoded.exp * 1000); 
            return res.status(200).send({
                valid: true,
                message: 'Succeed to login',
                tokenExpirationTime: expirationTime, 
                token: tokenStr
            })
        }).catch(err=>{
            console.log(err);
        })
    }
    createSSHTunnel(dbOperation)
}

// Retrive user information (Required: token)
let userInfo = (req, res) => {
    let token = req.headers['token']
    try {
        let decode = jwt.verify(token, secretKey).user_idStr;
        let dbOperation = (conn) => {
            let sqlStr = 'select user_id, firstname, surname, email from user_info where user_id=?'
            conn.query(sqlStr, [decode], (err, result) => {
                if(err) {
                    console.error(err)
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to get user information',
                        err: err.message
                    })
                }
            }).then(([rows]) => {
                return res.status(200).json(rows[0])
            })
        }
        createSSHTunnel(dbOperation)
    } catch (err) {
        console.log(err)
    }
}

// Update user information (Required: firstname, surname, email, user_id)
let updateUser = (req, res) => {
    let dbOperation = (conn) => {
        const sqlStr = `update user_info set firstname=?, surname=? ,email=? WHERE user_id=?`
        conn.query(sqlStr, [req.body.firstname, req.body.surname, req.body.email, req.body.user_id], (err, result) => {
            if(err) {
                console.error(err)
                return res.status(500).send({
                    valid: false, 
                    message: 'Failed to update user information',
                    err: err.message
                })
            }
            }).then(([rows]) => {
                if(rows.affectedRows === 1){
                    return res.status(200).send({valid: true,message: 'Succeed to update user information'})
                }else {
                    return res.status(200).send({valid: false, message: 'Failed to update user information'})
                }
        })
    }
    createSSHTunnel(dbOperation)
}

// update user password (Required: password, user_id)
let updatePWD = (req, res) => {
    let captchaCheckResult = captchaCheck.verifyCode(req, res, req.body.captcha)
    if (!captchaCheckResult.isValid) {
        return res.status(401).send({valid: false, message: 'captcha is not valid'})
    }
    let dbOperation = (conn) => {
        const sqlStr = 'update user_info set password=? WHERE user_id=?'
        conn.query(sqlStr, [md5(req.body.password), req.body.user_id], (err, result) => {
            if(err) {
                console.error(err)
                return res.status(500).send({
                    valid: false, 
                    message: 'Failed to update user password',
                    err: err.message
                })
            }
        }).then(([rows]) => {
            if(rows.affectedRows === 1){
                return res.status(200).send({valid: true,message: 'Succeed to update password'})
            }else {
                return res.status(200).send({valid: false, message: 'Failed to update password'})
            }
        })
    }
    createSSHTunnel(dbOperation)
}


module.exports = {
    connTest,
    register,
    login,
    userInfo,
    updateUser,
    updatePWD,
    verifyEmailUnique
}