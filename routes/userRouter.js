const express = require('express')
const app = express()
const controller = require('../controllers/index')
const { userLogin, userSighUp, passwordVallidate, handleValidationErrors } = require('../helpers/vallidation')
const { authenticateToken } = require('../helpers/middleware')

app.post('/userRegister', userSighUp, handleValidationErrors, controller.userController.registerUserByEmail)
app.post('/userRegisterByNumber', handleValidationErrors, controller.userController.registerUserByNumber)


app.post('/verifyOtp', handleValidationErrors, controller.userController.verifyOtp)
app.post('/setPassword', handleValidationErrors, controller.userController.setPassword)
app.post('/userLogin', handleValidationErrors, controller.userController.userLogin)



module.exports = app