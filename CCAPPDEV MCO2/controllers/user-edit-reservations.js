const Handlebars = require('handlebars'); // Assuming Handlebars is included
const express = require("express");
const reservationsEditRouter = express.Router();
const initializeUniqueTimes = require("./functions/time-functions.js").initializeUniqueTimes;
const formatWeekdayDate = require("./functions/time-functions.js").formatWeekdayDate;
const convertTimeIdToInterval = require("./functions/time-functions.js").convertTimeIdToInterval;
const keyLabNamesToSeatIds = require("./functions/time-functions.js").keyLabNamesToSeatIds;
const getUserType = require('./functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('./functions/user-info-evaluate-functions.js').getImageSource;
const getSeatDate = require('./functions/time-functions.js').getSeatDate;
const keyLabNamesToSeatIds_withNoFirstSeats = require("./functions/time-functions.js").keyLabNamesToSeatIds_withNoFirstSeats
const reservationModel = require("../models/reserve-model.js");

reservationsEditRouter.get('/edit/:resID/:roomName', async function(req, resp){
   try {
     allUniqueTimes = await initializeUniqueTimes(); // Wait for initialization
     const labSeatsMap = await keyLabNamesToSeatIds_withNoFirstSeats(req.params.resID);
     const labName = req.params.roomName;
     const userType = getUserType(req.session.user.dlsuID)
     console.log(labSeatsMap);
     var imageSource =  getImageSource(req.session.user.imageSource);
     const reservationID = req.params.resID

     resp.render('html-pages/reservation-edit/reserve-edit', {
       layout: 'edit/index-reservation-edit',
       title: 'Tech Reservations Edit',
       imageSource: imageSource,
       userType: userType,
       reservationID: reservationID,
       labName: labName,
       name: req.session.user.username,
       labName: labName,
       data: labSeatsMap,
       dlsuID: req.session.user.dlsuID,
       redirectBase: `/${userType}/`+req.session.user.dlsuID+`/edit/${req.params.resID}`,
       helpers: {
         isOngoing: function (string) { return string === 'Ongoing'; }
       }
     });


   } catch(error) {
     console.error("Error in route handler:", error);

   }

 });
 reservationsEditRouter.post('/edit/:resID/:roomName/post', async function(req, resp){
    try {
      console.log("Received edit post request")
      allUniqueTimes = await initializeUniqueTimes(); // Wait for initialization
      const labSeatsMap = await keyLabNamesToSeatIds_withNoFirstSeats(req.params.resID);
      const labName = req.body.labName;
      const resID = req.body.reservationID;
      userReservation = await reservationModel.findOne({reservationID: resID})
      const userType = getUserType(req.session.user.dlsuID)
      console.log(labSeatsMap);
      var imageSource =  getImageSource(req.session.user.imageSource);
      const response = {
        data: labSeatsMap,
        reservationID: resID,
        userID: userReservation.userID
      }
      resp.send(response);


    } catch(error) {
      console.error("Error in route handler:", error);

    }


  });

module.exports = reservationsEditRouter
