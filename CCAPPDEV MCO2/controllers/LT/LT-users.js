const express = require("express");
const bcrypt = require('bcrypt');
const ltRouter = express.Router();
const getUserType = require('../functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('../functions/user-info-evaluate-functions.js').getImageSource;
const getUserAbtMe = require('../functions/user-info-evaluate-functions.js').getUserAbtMe
const usersModel = require("../../models/register-model");
const getCourse = require('../functions/user-info-evaluate-functions.js').getCourse


ltRouter.get('/:id', function(req, resp){

  var abtMe = getUserAbtMe(req.session.user.about);
  var course = getCourse(req.session.user.course);
  var imageSource =  getImageSource(req.session.user.imageSource);
  if(req.session.user){

    console.log("Session Data: " + JSON.stringify(req.session));
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
