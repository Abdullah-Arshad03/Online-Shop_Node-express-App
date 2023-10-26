const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose')
const User = require('./models/user')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/404');

const app = express();

const store = new MongoDBStore({
  uri : "mongodb://127.0.0.1:27017/shop",
  collection : 'session',
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')
// const mongoConnect = require('./util/database').mongoConnect




app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : 'my secret' , resave : false , saveUninitialized : false , store : store }))

// const user_Id = req.session.user._id.toString()

app.use((req,res,next)=>{
  if(!req.session.user){
    return next()
  }

  const user_id = req.session.user._id.toString()
  User.findById(user_id).then((user)=>{
    // console.log('app mai session dekh raha houn', user_id)
    req.user = user
    next();
  }).catch((err)=>{
    console.log("this is the error",err)
  })

})



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(errorController.get404);


mongoose
  .connect('mongodb://127.0.0.1:27017/shop')
  .then(() => {
    console.log('connected using the Mongoose!!')  
    app.listen(3000);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });





















// mongoConnect(()=>{
//     app.listen(3000)
// })

