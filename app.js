const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose')
const User = require('./models/user')

const errorController = require('./controllers/404');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')
// const mongoConnect = require('./util/database').mongoConnect



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
      User.findById('651ba370788de65c7893eba1').then((user)=>{
        req.user = user
        next()
      }).catch((err)=>{
        console.log("User isn't exist right now ",err)
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
    User.findOne().then((user)=>{
      if (!user){
      const user = new User ({
        name : 'Abdullah Bin Arshad',
        email : 'abdullah@gmail.com',
        cart : {
          items : []
        }
      })
      user.save()
    }
    })
    app.listen(3000);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });





















// mongoConnect(()=>{
//     app.listen(3000)
// })

