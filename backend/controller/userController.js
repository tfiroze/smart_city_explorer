const jwt = require('jsonwebtoken')
const md5 = require('md5')
const createSSHTunnel = require('../db')
const captchaCheck = require('../services/emailVerification')

let secretKey = 'This is the smart_city_explorer app'

// Testing Database Connection
let connTest = (req, res) => {
    let dbOperation = (conn) => {
        conn.query('select * from user_info where user_id=1').then(([rows]) => {
            res.json(rows)
        }).catch((err) => {
            console.error(err);
        })
    }
    createSSHTunnel(dbOperation)
}

// Register (Required: firstname, surname, email, captcha, password)
let register = (req, res) => {
    let captchaCheckResult = captchaCheck.verifyCode(req, req.body.captcha)
    if (!captchaCheckResult.isValid) {
        return res.status(400).send({valid: false, message: 'captcha is not valid'})
    }
    let dbOperation = (conn) => {
        let sqlStr = 'insert into user_info (firstname, surname, email, password) values (?, ?, ?, ?)'
        conn.query(sqlStr, [req.body.firstname, req.body.surname, req.body.email, md5(req.body.password)], (err, result) => {
            if(err) {
                console.log(err.message)
                return res.status(400).send({valid: false, message: 'Failed to register'})
            }
        }).then(([rows]) => {
            if(rows.affectedRows === 1){
                return res.status(200).send({valid: true, message: 'Succeed to register'})
            }else {
                return res.status(400).send({valid: false, message: 'Failed to register'})
            }
        })
    }
    createSSHTunnel(dbOperation)
}

// Login (Required: email, password)
let login = (req, res) => {
    let dbOperation = (conn) => {
        sqlStr = 'select user_id, firstname, surname, email from user_info where email=? and password=?'
        conn.query(sqlStr, [req.body.email, md5(req.body.password)], (err, result) => {
            if(err) {
                console.error(err);
                return res.status(400).send({valid: false, message: 'Failed to login'})
            }
        }).then(([rows]) => {
            if(rows[0] == undefined) {
                return res.status(400).send({
                    valid:false,
                    message: 'wrong email or password'
                })
            }
            let user_idStr = rows[0].user_id
            let tokenStr = jwt.sign({user_idStr}, secretKey, {expiresIn: 7*24*60*60})
            return res.status(200).send({
                valid: true,
                message: 'Succeed to login',
                token: tokenStr
            })
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
                if(err) return res.status(400).send(err.message)
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

// update user password (Required: password, user_id)
let updatePWD = (req, res) => {
    let captchaCheckResult = captchaCheck.verifyCode(req, req.body.captcha)
    if (!captchaCheckResult.isValid) {
        return res.status(400).send({valid: false, message: 'captcha is not valid'})
    }
    let dbOperation = (conn) => {
        const sqlStr = 'update user_info set password=? WHERE user_id=?'
        conn.query(sqlStr, [md5(req.body.password), req.body.user_id], (err, result) => {
            if(err) return res.status(400).send(err.message)
        }).then(([rows]) => {
            return res.status(200).send({
                valid: true,
                message: 'Succeed to update password'
            })
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
    updatePWD
}