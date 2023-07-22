// For the test, I'm using my personal email(a1357924691@gmail.com) to send captcha

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
    // create smtp connection
    let tranSports = nodemailer.createTransport({
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
        html : `<div style='width:600px;margin:30px auto'><h1 style='text-align:center'>Welcome to register for Smart City Explorer</h1><p style='font-size:24px'>This is your captcha:</p><strong style='font-size:20px;display:block;text-align:center;color:red'>${newCode}</strong><p>This captcha is only valid in 10 minutes</p><i style='color:#00bfff'>This email is sent automatically by the system. Please do not reply! If you haven't registered, please ignore it.</i></div>`,
    }
    tranSports.sendMail(options, function(err,msg) {
        if(err){
            res.send(err)
            res.end()
        }else{
            res.send(msg)
            res.end()
            transporter.close()
        }
    })
}

module.exports = {
    sendCaptcha
}