// For the test, I'm using my personal email
// a1357924691@gmail.com    zzdsoprdlrlxxjfq
// 3037615469@qq.com    shvwybgfyfzudfbd

const nodemailer = require('nodemailer')

let newCode

// generate captcha
function createCode(){
    let str = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890'
    let arr = ''
    for(let i = 0;i < 6;i++){
        arr += str.charAt(Math.random() * str.length | 0)
    }
    return newCode = arr
}

let sendCaptcha = (req,res) => {
    let userMail = req.body.email
    createCode()
    // storeCodeToSession(req, '123456')   // Test: set captcha 123456
    storeCodeToSession(req, newCode)

    // create smtp connection
    let transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user : 'a1357924691@gmail.com',
            pass : 'zzdsoprdlrlxxjfq'
        }
    })

    // content of email
    let options = {
        from : 'a1357924691@gmail.com',
        to : userMail,
        subject : 'Welcome to Smart City Explorer',
        html : `<div style='width:600px;margin:30px auto'><h1 style='text-align:center'>Welcome to Smart City Explorer</h1><p style='font-size:24px'>This is your captcha:</p><strong style='font-size:20px;display:block;text-align:center;color:red'>${newCode}</strong><p>This captcha is only valid in 10 minutes</p><i style='color:#00bfff'>This email is sent automatically by the system. Please do not reply! <br> If you haven't registered, please ignore it.</i></div>`,
    }
    transport.sendMail(options, function(err,msg) {
        if(err){
            res.send(err)
            res.end()
        }else{
            res.send(msg)
            res.end()
            transport.close()
        }
    })
}

// Store the captcha in the Session and expiration time is ten minutes
function storeCodeToSession(req, code) {
    req.session.captcha = code
    req.session.startTimestamp = Date.now()
}
  
// Check if the user-entered captcha is correct or has expired.
function verifyCode(req, enteredCode) {
    let captcha = req.session.captcha
    let startTimestamp = req.session.startTimestamp

    if (!captcha || !startTimestamp) {
        return { isValid: false, message: 'Verification code not found. Please request a new one.' }
    }
  
    const currentTime = Date.now();
    // captcha will expire in 10 minutes
    if (currentTime - startTimestamp > 10 * 60 * 1000) {
        return { isValid: false, message: 'Verification code has expired. Please request a new one.' };
    }
  
    if (enteredCode === captcha) {
        return { isValid: true, message: 'Verification successful!' };
    } else {
        return { isValid: false, message: 'Invalid verification code!' };
    }
}



module.exports = {
    sendCaptcha,
    verifyCode
}