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
     
      User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email Exists Already, Please Pick A Different One");
        return res.redirect("/signup");
      }
    })
    
    }),

  check(
    "password",
    "Please enter a password with only numbers and text and should contain atleast 5 characters!"
  ).isLength({min:5}).isAlphanumeric(),

  check('confirmPassword').custom((value, {req})=>{
    if(value !== req.body.password){
        throw new Error('Passwords have to match!')
    }
    return true

    
  } )

],
  authController.postSignup
);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
