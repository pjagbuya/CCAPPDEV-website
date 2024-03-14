const express = require("express");
const bcrypt = require('bcrypt');
const registerLoginRouter = express.Router();
const mongoose = require('mongoose');


 const registerModel = require("../models/register-model");



registerLoginRouter.get('/register', function(req, resp){
    resp.render('html-pages/login-reg/register',{
        layout: 'home/index-home',
        title: 'Register Page'

    });
});




registerLoginRouter.post('/register', async (req, resp) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const info = {
      username : req.body.username,
      dlsuID  : req.body.id,
      email    : req.body.email,
      password : hashedPassword,
      imageSource: null,
      firstName : req.body.firstname,
      lastName  : req.body.lastname,
      middleInitial: req.body.mi,
      course: null,
      about: null,

    };

    const registerInstance = await registerModel.create(info)


    console.log("Before saving:", registerInstance.toObject()); // Log object before saving

    registerInstance.save().then(function(login)
    {
      console.log('User created');
      resp.redirect('/login');

    });
    console.log("Saved user data:", registerInstance.toObject()); // Log object after saving

    // console.log(info);

  } catch (e) {

    console.log('Failure');
    console.error(e);
    console.error("Error:" + e.stack);
    resp.redirect("/register");

  }
  console.log("Received post request and created user");



});


const loginRouter = require('./login');
registerLoginRouter.use("/", loginRouter);


module.exports = registerLoginRouter
