const express = require("express");
const bcrypt = require('bcrypt');
const ltRouter = express.Router();

const usersModel = require("../../models/register-model");




ltRouter.get('/:id', function(req, resp){

  var abtMe;
  var course;
  var imageSource;
  if(req.session.user){

    if(req.session.user.about){
      abtMe = req.session.user.about;
    }else{
      abtMe = "User has yet to input a description"
    }
    if(req.session.user.course){
      course = req.session.user.course;
    }else{
      course = "User has yet to input a course"
    }

    if(req.session.user.imageSource){
      imageSource = req.session.user.imageSource
    }else{
      imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
    }

    console.log("Image founded is "+ imageSource)
    console.log("Logged in as")
    console.log(req.session.user)

    resp.render('html-pages/LT/LT-profile',{
        layout: 'LT/index-LT-user',
        title: 'Tech ' + req.session.user.username,
        name: req.session.user.username,
        userType: 'lt-user',
        imageSource: imageSource,
        fullName: req.session.user.firstName +' ' +
                  req.session.user.middleInitial + ' ' +
                  req.session.user.lastName,
        dlsuID: req.session.user.dlsuID,
        email: req.session.user.email,
        redirectReserve: "/lt-user/" + req.session.user.dlsuID + "/reserve",
        redirectEdit: "/lt-user/" + req.session.user.dlsuID + "/view"

    });

  }


});

const searchUserRouter = require('../search-user');
ltRouter.use("/", searchUserRouter);


const reserveRouter = require('./LT-reserve');
ltRouter.use("/:id/", reserveRouter);
const viewEditRouter = require('./LT-view-edit').viewEditRouter;
ltRouter.use("/:id/", viewEditRouter);
module.exports = ltRouter;
