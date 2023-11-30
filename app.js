const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require('connect-flash')
const multer = require('multer')


const errorController = require("./controllers/404");

const app = express();

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/shop",
  collection: "session",
});

const fileStorage = multer.diskStorage({
  destination : ((req, file , cb)=>{
    cb(null , 'images')
  }) , 
  filename : ((req, file , cb)=>{
    cb(null ,  file.originalname)

  })
})

const fileFilter = (req, file , cb)=>{
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null , true)
  }
  else {
    cb(null, false)
  }
}

const csrfProtection = csurf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage : fileStorage , fileFilter : fileFilter}).single('image'))


app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));


app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection)
app.use(flash())


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  const user_id = req.session.user._id.toString();
  User.findById(user_id)
    .then((user) => {
      // console.log('app mai session dekh raha houn', user_id)
      req.user = user;
      next();
    })
    .catch((err) => {
      next(err)
    });
});

app.use((req,res,next)=>{
  res.locals.isAuthenticated= req.session.isLoggedIn 
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500',errorController.get505)
app.use(errorController.get404);


app.use((error , req , res , next)=>{
  res.status(500).render('500',{
    pageTitle : 'Technical Eror',
    path : '/500',
    isAuthenticated : req.session.isLoggedIn
  })
})
mongoose
  .connect("mongodb://127.0.0.1:27017/shop")
  .then(() => {
    console.log("connected using the Mongoose!!");
    app.listen(3000);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

