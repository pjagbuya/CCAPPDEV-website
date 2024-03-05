const express = require("express");
const bcrypt = require('bcrypt');
const registerLoginRouter = express.Router();
const withMongo = require('../app.js').withMongo;

const collectionLogin = "User";






registerLoginRouter.get('/register', function(req, resp){
    resp.render('html-pages/login-reg/register',{
        layout: 'index-home',
        title: 'Register Page'

    });
});




registerLoginRouter.post('/register', withMongo(async (req, resp) => {


  const col = req.db.collection(collectionLogin);


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
    };

    col.insertOne(info)

    resp.redirect('/login');


  } catch (e) {
    resp.redirect("/register");

  }
  console.log("Received post request and created user");



}));


const loginRouter = require('./login');
registerLoginRouter.use("/", loginRouter);


module.exports = registerLoginRouter
