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

// verify email unique (Required: email)
let verifyEmailUnique = (req, res, next) => {
    try{
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            let sqlStr = 'SELECT COUNT(*) as count FROM user_info WHERE email =?'
            conn.query(sqlStr, [req.body.email], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
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
                    conn.release()
                    return res.status(200).send({valid: false, message: 'Email has been registered'})
                }
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err){
        console.error(err)
        return res.status(200).send({valid:false,message:'Failed to verify email'})
    }
}

// Register (Required: firstname, surname, email, captcha, password)
let register = (req, res) => {
    try {
        let captchaCheckResult = captchaCheck.verifyCode(req)
        if (!captchaCheckResult.isValid) {
            return res.status(401).send({valid: false, message: captchaCheckResult.message})
        }
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Invalid captcha'})
    }
    try{
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            let sqlStr = 'insert into user_info (firstname, surname, email, password) values (?, ?, ?, ?)'
            conn.query(sqlStr, [req.body.firstname, req.body.surname, req.body.email, md5(req.body.password)], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to register',
                        err: err.message
                    })
                }
            }).then(([rows]) => {
                if(rows.affectedRows === 1){
                    req.session.destroy((err) => {
                        if (err) {
                          console.error('Error destroying session:', err)
                          conn.release()
                          return res.status(500).send({ message: 'Error destroying session' })
                        }
                    })
                    conn.release()
                    return res.status(200).send({valid: true, message: 'Succeed to register'})
                }else {
                    conn.release()
                    return res.status(200).send({valid: false, message: 'Failed to register'})
                }
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err){
        console.error(err)
        return res.status(200).send({valid:false,message:'Failed to register'})
    }
}

// Login (Required: email, password)
let login =  (req, res) => {
    try{
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection();
            sqlStr = 'select user_id, firstname, surname, email from user_info where email=? and password=?'
            conn.query(sqlStr, [req.body.email, md5(req.body.password)], (err, result) => {
                if(err) {
                    console.error(err);
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to login',
                        err: err.message
                    })
                }
            }).then(([rows]) => {
                if(rows[0] == undefined) {
                    conn.release()
                    return res.status(200).send({valid:false,message: 'wrong email or password'})
                }
                let user_idStr = rows[0].user_id
                let tokenStr = jwt.sign({user_idStr}, secretKey, {expiresIn: 7*24*60*60})
    
                const decoded = jwt.decode(tokenStr);
    
                const expirationTime = new Date(decoded.exp * 1000); 
                conn.release()
                return res.status(200).send({
                    valid: true,
                    message: 'Succeed to login',
                    tokenExpirationTime: expirationTime, 
                    token: tokenStr
                })
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid:false,message:'Failed to login'})
    }
}

// Retrive user information (Required: token)
let userInfo = (req, res) => {
    let token = req.headers['token']
    try {
        let decode = jwt.verify(token, secretKey).user_idStr;
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            let sqlStr = 'select user_id, firstname, surname, email from user_info where user_id=?'
            conn.query(sqlStr, [decode], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to get user information',
                        err: err.message
                    })
                }
            }).then(([rows]) => {
                conn.release()
                return res.status(200).json(rows[0])
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    } catch (err) {
        console.error(err)
        res.status(200).send({valid: false,message: 'Invalid token'})
    }
}

// Update user information (Required: firstname, surname, email, user_id)
let updateUser = (req, res) => {
    try {
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            const sqlStr = `update user_info set firstname=?, surname=? ,email=? WHERE user_id=?`
            conn.query(sqlStr, [req.body.firstname, req.body.surname, req.body.email, req.body.user_id], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to update user information',
                        err: err.message
                    })
                }
                }).then(([rows]) => {
                    if(rows.affectedRows === 1){
                        conn.release()
                        return res.status(200).send({valid: true,message: 'Succeed to update user information'})
                    }else {
                        conn.release()
                        return res.status(200).send({valid: false, message: 'Failed to update user information'})
                    }
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid:false, message:'Failed to update user info'})
    }
}

// check user email address, find the user_id (Required: email)
let checkRegisteredEmail = (req, res, next) => {
    let dbOperation = async (connection) => {
        let conn = await connection.getConnection()
        try {
            let sqlStr = 'SELECT user_id FROM user_info WHERE email =?'
            conn.query(sqlStr, [req.body.email], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false,
                        message: 'Failed to register',
                        err: err.message
                    })
                }
            }).then(([rows]) => {
                if(rows[0].user_id){
                    req.body.user_id = rows[0].user_id
                    next()
                }else {
                    conn.release()
                    return res.status(200).send({valid: false, message: 'Email has not found'}) 
                }
            })
        }catch (err) {
            console.error(err)
            return res.status(200).send({valid: false, message: 'Email has not found'})   
        }  
    }
    // createSSHTunnel(dbOperation)
    dbOperation(createSSHTunnel)
}

// reset user password when forget (Required: password, captcha)
let forgetPWD = (req, res) => {
    try {
        let captchaCheckResult = captchaCheck.verifyCode(req)
        if (!captchaCheckResult.isValid) {
            return res.status(200).send({valid: false, message: 'captcha is not valid'})
        }
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            const sqlStr = 'update user_info set password=? WHERE user_id=?'
            conn.query(sqlStr, [md5(req.body.password), req.body.user_id], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to update user password',
                    })
                }
            }).then(([rows]) => {
                if(rows.affectedRows === 1){
                    conn.release()
                    return res.status(200).send({valid: true,message: 'Succeed to update password'})
                }else {
                    conn.release()
                    return res.status(200).send({valid: false, message: 'Failed to update password'})
                }
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to update password'})
    }
}

// check user old password (Required: token, old_password)
let checkPWD = (req, res, next) => {
    let token = req.headers['token']
    try{
        let decode = jwt.verify(token, secretKey).user_idStr;
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            const sqlStr = 'select password from user_info WHERE user_id=?'
            conn.query(sqlStr, [decode], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to update user password',
                    })
                }
            }).then(([rows]) => {
                if(rows[0].password == md5(req.body.old_password)){
                    next()
                }else {
                    conn.release()
                    return res.status(200).send({valid: false, message: 'Wrong old password'})
                }
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err) {
        console.error(err)
        return res.status(200).send({valid: false, message: 'Failed to update password'})
    }
}

// update user password (Required: token, password)
let updatePWD = (req, res) => {
    let token = req.headers['token']
    try {
        let decode = jwt.verify(token, secretKey).user_idStr;
        let dbOperation = async (connection) => {
            let conn = await connection.getConnection()
            const sqlStr = 'update user_info set password=? WHERE user_id=?'
            conn.query(sqlStr, [md5(req.body.password), decode], (err, result) => {
                if(err) {
                    console.error(err)
                    conn.release()
                    return res.status(500).send({
                        valid: false, 
                        message: 'Failed to update user password',
                        err: err.message
                    })
                }
            }).then(([rows]) => {
                if(rows.affectedRows === 1){
                    conn.release()
                    return res.status(200).send({valid: true,message: 'Succeed to update password'})
                }else {
                    conn.release()
                    return res.status(200).send({valid: false, message: 'Failed to update password'})
                }
            })
        }
        // createSSHTunnel(dbOperation)
        dbOperation(createSSHTunnel)
    }catch(err){
        console.error(err)
        return res.status(200).send({valid:false, message:'Failed to update password'})
    }
}


module.exports = {
    connTest,
    register,
    login,
    userInfo,
    updateUser,
    forgetPWD,
    updatePWD,
    checkPWD,
    verifyEmailUnique,
    checkRegisteredEmail
}