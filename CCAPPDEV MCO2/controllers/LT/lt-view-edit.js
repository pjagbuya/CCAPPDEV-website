const express = require("express");
const bcrypt = require('bcrypt');
const viewEditRouter = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../../models/register-model");
const labModel = require("../../models/lab-model").LabModel;
const reservationModel = require("../../models/reserve-model");
const Time = require("../../models/time-model");
const initializeUniqueTimes = require("../functions/time-functions.js").initializeUniqueTimes;
const formatWeekdayDate = require("../functions/time-functions.js").formatWeekdayDate;
const convertTimeIdToInterval = require("../functions/time-functions.js").convertTimeIdToInterval;
const keyLabNamesToSeatIds = require("../functions/time-functions.js").keyLabNamesToSeatIds;
const getUserType = require('../functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('../functions/user-info-evaluate-functions.js').getImageSource;
const getSeatDate = require('../functions/time-functions.js').getSeatDate;
var allUniqueTimes;





viewEditRouter.get('/view', async function(req, resp){
  console.log("Loaded");
  console.log("Welcome to viewing reservation user: " + req.session.user.dlsuID);

  try {

    var imageSource =  getImageSource(req.session.user.imageSource);

    const reservations = await reservationModel.find({}).sort({ reservationStatus: 1 });

    var uid = req.session.user.dlsuID;

    resp.render('html-pages/LT/LT-view-reservations', {
      layout: 'LT/index-LT-view-reservations',
      title: 'Tech Reservations View',
      userType: 'lt-user',
      imageSource: imageSource,
      name: req.session.user.username,
      dlsuID: uid,
      redirectBase: `/lt-user/${uid}/view/`,
      reservations: JSON.parse(JSON.stringify(reservations)),
      helpers: {
        isOngoing: function (string) { return string === 'Ongoing'; },

      }
    });



  } catch (e) {
     console.error("Error retrieving users:", e);
  }

});


viewEditRouter.get('/view/:resID', async function(req, resp){
   try {
     allUniqueTimes = await initializeUniqueTimes(); // Wait for initialization
     const labSeatsMap = await keyLabNamesToSeatIds(req.params.resID);
     console.log(labSeatsMap);
     var imageSource =  getImageSource(req.session.user.imageSource);

     resp.render('html-pages/LT/LT-reservation-data', {
       layout: 'LT/index-LT-view-reservations',
       title: 'Tech Reservations View',
       imageSource: imageSource,
       userType: 'lt-user',
       name: req.session.user.username,
       data: labSeatsMap,
       dlsuID: req.session.user.dlsuID,
       redirectBase: "/lt-user/"+req.session.user.dlsuID+`/view/${req.params.resID}`,
       helpers: {
         isOngoing: function (string) { return string === 'Ongoing'; }
       }
     });


   } catch(error) {


     console.error("Error in route handler:", error);
     // Handle the error appropriately
   }


 });

const searchUserRouter = require('../search-user');
viewEditRouter.use("/", searchUserRouter);


module.exports.viewEditRouter = viewEditRouter;
