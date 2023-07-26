const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')
const tripController = require('./controller/tripController')
const emailVerification = require('./services/emailVerification')

router.use(express.urlencoded({ extended:false }))
router.use(express.json())

// router.get('/connTest', userController.connTest)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/users', userController.userInfo)
router.put('/users', userController.updateUser)
router.patch('/users', userController.updatePWD)
router.post('/emails', emailVerification.sendCaptcha)
router.get('/trips/info/:user_id', tripController.tripsInfo)
router.get('/trips/:trip_id', tripController.tripInfo)
router.post('/trips', tripController.addTrip)
router.put('/trips', tripController.updateTrip)
router.delete('/trips', tripController.deleteTrip)

module.exports = router