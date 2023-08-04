const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')
const tripController = require('./controller/tripController')
const emailVerification = require('./services/emailVerification')
const distanceModel = require('./services/venue_model/exec_venue_model')
const weather = require('./services/weather/weather')

router.use(express.urlencoded({ extended:false }))
router.use(express.json())

router.get('/connTest', userController.connTest)

router.post('/register', userController.verifyEmailUnique, userController.register)
router.post('/login', userController.login)
router.get('/users', userController.userInfo)
router.put('/users', userController.updateUser)
router.post('/password', userController.checkRegisteredEmail, userController.forgetPWD)
router.patch('/password', userController.checkPWD, userController.updatePWD)

router.post('/emails', userController.verifyEmailUnique, emailVerification.sendCaptcha)
router.post('/captcha', emailVerification.sendCaptcha)

router.get('/trips/all/:user_id', tripController.upcomingTripsInfo, tripController.completedTripsInfo)
router.get('/trips/:trip_id', tripController.tripInfo)
router.post('/trips', tripController.addTrip)
router.put('/trips', tripController.updateTrip)
router.delete('/trips', tripController.deleteTrip)

router.post('/venues', distanceModel.getRecommendVenues)

router.get('/tripinfoquestionnaire', tripController.getTripInfoQuestionnaireMW, tripController.getTripInfoQuestionnaire)

router.get('/weathers', weather.getWeather)

module.exports = router