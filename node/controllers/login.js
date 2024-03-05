
const express = require("express");
const bcrypt = require('bcrypt');
const loginRouter = express.Router();
const withMongo = require('../app.js').withMongo;
const collectionLogin = "User"

loginRouter.get('/login', function(req, resp){


    resp.render('html-pages/login-reg/login',{
        layout: 'index-home',
        title: 'Login Page'

    });
});

loginRouter.post('/login',  withMongo(async (req, resp) =>{

  const userID = req.body.userID;  // Assuming userID is sent in the request body

  try {

    const col = req.db.collection(collectionLogin);


    const user = await col.findOne({
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
      console.log("Success");

      req.session.user = user;

      resp.redirect("/user/"+ user.dlsuID);

    }
    else{
     console.log("Error password");

     resp.redirect("/login");
    }


  } catch (error) {
    console.error("Error during login:", error);
    resp.status(500).send({ error: "Internal server error" });
  }

}));


const userRouter = require('./users');
loginRouter.use("/user", userRouter);

module.exports = loginRouter
