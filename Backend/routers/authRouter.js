const express = require('express')
const router = express.Router();
const authController  =require('../controllers/authController')
const validator = require('../validator/employeeValidator')

router.post('/request-otp',
    validator.requestOtpValidator,
    authController.requestOTP
)

router.post('/verify-otp',
    validator.verifyOtpValidator,
    authController.verifyOTP
)

module.exports=router