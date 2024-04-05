if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config
}

const express = require("express");
const bcrypt = require('bcrypt');
const passport = require('passport')
const loginRouter = express.Router();
const initializePassport = require('./passport-config');
initializePassport(passport,
)
const flash = require('express-flash')
const session = require('express-session')
const collectionLogin = "User"

const loginModel = require('../models/register-model');


loginRouter.use(flash())
loginRouter.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

loginRouter.use(passport.initialize());
loginRouter.use(passport.session());
loginRouter.get('/login', function(req, resp){
    resp.render('html-pages/home/H-login',{
        layout: 'home/index-home',
        title: 'Login Page'
    });
});

loginRouter.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect:'/login',
  failureFlash:true
});

loginRouter.post('/login', async (req, resp) => {
  const userID = req.body.userID;

  try {
      let user;

      const isNumber = !isNaN(userID);

      if (isNumber) {
          user = await loginModel.findOne({ dlsuID: userID });
      } else {
          user = await loginModel.findOne({ email: userID });
      }


      if (!user) {
          console.log("User not found");

          return resp.redirect("/login?error=User not found");
      }


      if (user.isActive === false) {
          console.log("User is deleted");

          return resp.redirect("/login?error=User is deleted");
      }

      console.log("Found user");

      if (await bcrypt.compare(req.body.password, user.password)) {
          req.session.user = user;


          if (user.dlsuID.toString().slice(0, 3) === "101") {
              console.log("Success Lab technician");
              resp.redirect("/lt-user/" + user.dlsuID);
          } else {
              console.log("Success");
              resp.redirect("/user/" + user.dlsuID);
          }
      } else {
          console.log("Error password");

          resp.redirect("/login?error=Invalid password");
      }
  } catch (error) {
      console.error("Error during login:", error);

      resp.redirect("/login?error=Internal server error");
  }
});

loginRouter.use('/auth', authRoute)
const userRouter = require('./users');
loginRouter.use("/user", userRouter);

const ltRouter = require('./LT/LT-users');
loginRouter.use("/lt-user", ltRouter);

module.exports = loginRouter;
