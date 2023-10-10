const User = require('../models/user')

exports.getLogin = (req ,res , next) =>{
  // const isLoggedIn = req.get('Cookie').split('=')[1]
  console.log('in login',req.session.isLoggedIn)
    res.render("auth/login.ejs", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated : false
      });
}

exports.postLogin = (req ,res , next) =>{

//  res.setHeader('Set-Cookie' , 'loggedIn=true ; ') 
User.findById('6523c17fea6dad73ee62dbdf').then((user)=>{
  req.session.isLoggedIn = true
  req.session.user = user
  res.redirect('/')
}).catch((err)=>{
  console.log("User isn't exist right now ",err)
})
}

