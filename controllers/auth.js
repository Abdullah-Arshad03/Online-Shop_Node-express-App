const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1]
  console.log('in login', req.session.isLoggedIn)
  res.render("auth/login.ejs", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false
  });
}

exports.postLogin = (req, res, next) => {

  //  res.setHeader('Set-Cookie' , 'loggedIn=true ; ') 
  User.findById('65339cd3ade92730baae5a24').then((user) => {
    req.session.isLoggedIn = true
    req.session.user = user
    res.session.save((err) => {
      res.redirect('/')
    })
  }).catch((err) => {
    console.log("User isn't exist right now ", err)
  })
}
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/')
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: "signup",
    path: 'signup',
    isAuthenticated: false
  })
}
exports.postSignup = (req, res, next) => {

  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save();
    }).then(() => {
      return res.redirect('/login')
    })
  }).catch((err) => {
    console.log('user isnt set ', err)
  })

}