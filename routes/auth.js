const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/auth");
const User = require('../models/user')


router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);
router.post(
  "/signup",
[
  check("email")
    .isEmail()
    .withMessage("Please Enter a Valid Email")
    .custom((value, { req }) => {
     return User.findOne({ email: value })
    .then((userDoc) => {
      if (userDoc) {
        return Promise.reject('Email Exists Already, Please Pick A Different One')
      }
    })
    }).normalizeEmail(),

  check(
    "password",
    "Please enter a password with only numbers and text and should contain atleast 5 characters!"
  ).notEmpty().isLength({min:5}).isAlphanumeric().trim(),

  check('confirmPassword').custom((value, {req})=>{
    if(value !== req.body.password){
        throw new Error('Passwords have to match!')
    }
    return true

    
  } ).trim()

],
  authController.postSignup
);
router.post("/login", [
  check('email', 'Please Enter a valid Email Address to login').isEmail().normalizeEmail().custom((value , {req})=>{
    return User.findOne({email : value}).then((userDoc)=>{
      if(!userDoc){
        return Promise.reject('User isnt Signed Up, Make sure to sign up')
      }
     req.userDoc = userDoc
     return true
    })
  }),
  check('password','Please Enter Valid password').notEmpty().isLength({min:5}).trim()
], authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
