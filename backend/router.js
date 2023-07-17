const express = require('express')
const router = express.Router()
const controller = require('./controller')
const  bodyParser = require('body-parser')

router.use(express.urlencoded({ extended:false }))
router.use(express.json())

router.get(['/', '/index'], controller.indexPage)
router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/users', controller.userInfo)

module.exports = router