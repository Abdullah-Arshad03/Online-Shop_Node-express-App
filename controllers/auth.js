const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const User = require("../models/user");


const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
 api_key : "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"
  }
}))

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1]

  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render("auth/login.ejs", {
    pageTitle: "Login",
    path: "/login",
    errorMessage : message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid Email or Password ')
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/");
          }
          req.flash('error', 'Invalid Email or Password ')
          res.redirect("/login");
        })
        .catch((err) => {
          console.log("error in the comparing passwords in bcrypt", err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  //  res.setHeader('Set-Cookie' , 'loggedIn=true ; ')

};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message= req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "signup",
    errorMessage : message
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error' , 'Email Exists Already, Please Pick A Different One')
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
         return transporter.sendMail({
            to : email,
            from : 'aligatorabdullah@gmail.com',
            subject : 'Signup Succeeded!',
            html :'<h1> You Successfully Signed Up </h1><br><h4> Regards, <h4<h3> Abdullah Bin Arshad </h3>'
          })
        }).catch(err =>{console.log(err)})
    })
    .catch((err) => {
      console.log("user isnt set ", err);
    });
};

exports.getReset = (req, res, next) => {

  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render("auth/reset", {
    pageTitle: "Reset",
    path: "/login",
    errorMessage : message
  });
};

exports.postReset = (req,res,next)=>{
  const email = req.body.email
      crypto.randomBytes(32, (err , buffer)=>{
        if(err){
          console.log(err)
          return res.redirect('/reset')
        }
        User.findOne({ email : req.body.email}).then((user)=>{
          if(!user){
            req.flash('error', 'The email you enterd isnt registered in Database !')
            return res.redirect('/reset')
          }
          const token = buffer.toString('hex')
          user.resetToken = token 
          user.resetTokenExpiration = Date.now() + 3600000
          return user.save()
        }).then((result)=>{
             res.redirect('/')
             transporter.sendMail({
              to : email,
              from : 'aligatorabdullah@gmail.com',
              subject : 'Password Reset Mail',
              html : `
              <p>You requested a password Reset!</p>
              <p> Click the below link to set  new password</p>
              <a href="http://localhost:3000/reset/${result.resetToken}">click here</a>
              `
             }).then((send)=>{
              console.log('mail has been sent', send)

             }).catch(err => console.log('mail hasnt been sent'))
        })
        .catch(err => {
          console.log(err)

        })
      })
}