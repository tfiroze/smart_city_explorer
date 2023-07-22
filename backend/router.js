const express = require('express')
const router = express.Router()
const controller = require('./controller')
const emailVerification = require('./services/emailVerification')

router.use(express.urlencoded({ extended:false }))
router.use(express.json())

// router.get('/connTest', controller.connTest)
router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/users', controller.userInfo)
router.put('/users', controller.userUpdate)
router.patch('/users', controller.pwdUpdate)
router.post('/emails', emailVerification.sendCaptcha)

module.exports = router