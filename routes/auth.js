const express = require ('express')
const router = express.Router()
// const expValidator = require('express-validator/check')
//expValidator is the Js object and contain the multiple things in
// it, so we can destruct it, using the object destructuring.

// const { check } = require('express-validator/check')

// check property, this holds a function, this basically a function.
// this check function, also returns the middleware.




const authController = require('../controllers/auth')

router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.get('/reset',authController.getReset )
router.get('/reset/:token', authController.getNewPassword)

router.post('/signup', authController.postSignup)

router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.post('/reset',authController.postReset )
router.post('/new-password', authController.postNewPassword)


module.exports = router