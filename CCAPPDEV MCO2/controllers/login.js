
const express = require("express");
const bcrypt = require('bcrypt');
const loginRouter = express.Router();


const flash = require('express-flash')
const session = require('express-session')

const collectionLogin = "User"
const authRoute = require('./auth');
const loginModel = require('../models/register-model');
const remberModel = require('../models/chat-model').remberModel;

loginRouter.get('/login', function(req, resp){

    remberModel.find().lean().then(function(maalaalaMoKaya){
        var pinakamalakingIndex = maalaalaMoKaya.length;

        var rememberMe = '';
        var loginDetails = '';
        var loginPassword = '';

        if(pinakamalakingIndex > 0){
            console.log("relogin")
            rememberMe = maalaalaMoKaya[pinakamalakingIndex-1].maalaalaMoKaya;
            loginDetails = maalaalaMoKaya[pinakamalakingIndex-1].loginID;
            loginPassword = maalaalaMoKaya[pinakamalakingIndex-1].loginPass;
        }
        else{
            rememberMe = false;
            loginDetails = '';
            loginPassword = '';
        }

        console.log("Session Data for login: " + JSON.stringify(req.session));
        resp.render('html-pages/home/H-login',{
            layout: 'home/index-home',
            title: 'Login Page',
            rememberMe : rememberMe,
            loginDetails : loginDetails,
            loginPassword : loginPassword
        });
        resp.redirect
    });
});

loginRouter.post('/load-login', function(req, resp){

    remberModel.find().lean().then(function(maalaalaMoKaya){
        var pinakamalakingIndex = maalaalaMoKaya.length;

        var rememberMe = '';
        var loginDetails = '';
        var loginPassword = '';

        if(pinakamalakingIndex > 0){
            console.log("relogin")
            rememberMe = maalaalaMoKaya[pinakamalakingIndex-1].maalaalaMoKaya;
            loginDetails = maalaalaMoKaya[pinakamalakingIndex-1].loginID;
            loginPassword = maalaalaMoKaya[pinakamalakingIndex-1].loginPass;
        }
        else{
            rememberMe = false;
            loginDetails = '';
            loginPassword = '';
        }

        console.log("Session Data for login: " + JSON.stringify(req.session));
        resp.send({
            rememberMe : rememberMe,
            loginDetails : loginDetails,
            loginPassword : loginPassword
        });
    });
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
          req.session.loginDetails = req.body.userID;
          req.session.loginPassword = req.body.password;

          if (user.dlsuID.toString().slice(0, 3) === "101") {
              req.session.isAuth = true
              console.log("Success Lab technician");
              resp.redirect("/lt-user/" + user.dlsuID);
          } else {
              req.session.isAuth = true
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




const userRouter = require('./users');
loginRouter.use("/user", userRouter);

const ltRouter = require('./LT/LT-users');
const { ConnectionClosedEvent } = require("mongodb");
loginRouter.use("/lt-user", ltRouter);

module.exports = loginRouter;
