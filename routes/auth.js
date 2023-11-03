const express = require ('express')
const router = express.Router()

const authController = require('../controllers/auth')


router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.get('/reset',authController.getReset )
router.post('/signup', authController.postSignup)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.post('/reset',authController.postReset )



module.exports = router