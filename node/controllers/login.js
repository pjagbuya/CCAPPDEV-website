
const express = require("express");
const bcrypt = require('bcrypt');
const loginRouter = express.Router();

const collectionLogin = "User"

const loginModel = require('../models/register-model');





loginRouter.get('/login', function(req, resp){


    resp.render('html-pages/login-reg/login',{
        layout: 'index-home',
        title: 'Login Page'

    });
});

loginRouter.post('/login',  async (req, resp) =>{


  const userID = req.body.userID;

  try {
    const user = await loginModel.findOne({
      $or: [
        { dlsuID: userID },
        { email: userID },
        { username: userID }
      ]
    });

    if (!user) {
      console.log("User not found");
      resp.send({ error: "Invalid username or password" });
      return;
    }


    console.log("Found user");
    if(await bcrypt.compare(req.body.password, user.password)){

      req.session.user = user;


      if(user.dlsuID.toString().slice(0,3)=="101")
      {
        console.log("Success Lab technician");
        resp.redirect("/lt-user/"+ user.dlsuID);
      }
      else{
        console.log("Success");
        resp.redirect("/user/"+ user.dlsuID);
      }


    }
    else{
     console.log("Error password");
     resp.redirect("/login");
    }


  } catch (error) {
    console.error("Error during login:", error);
    resp.status(500).send({ error: "Internal server error" });
  }

});


const userRouter = require('./users');
loginRouter.use("/user", userRouter);

const ltRouter = require('./LT-user.js');
loginRouter.use("/lt-user", ltRouter);

module.exports = loginRouter
