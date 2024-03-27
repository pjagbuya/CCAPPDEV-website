const express = require("express");
const bcrypt = require('bcrypt');
const reserveRouter = express.Router();
const mongoose = require("mongoose");
const hbs = require("handlebars");
const usersModel = require("../../models/register-model");
const labModel = require("../../models/lab-model").LabModel;
const seatModel = require("../../models/lab-model").SeatModel;
const Reservation = require("../../models/reserve-model");
const segregateSeats = require("../../models/lab-model").segregateSeats;
const getUniqueSeatNumbers = require("../../models/lab-model").getUniqueSeatNumbers
const getSeatTimeRange = require("../../models/lab-model").getSeatTimeRange;
const timeModel = require("../../models/time-model");
const updateLabInformation = require("../../models/lab-model").updateLabInformation;
const getUserType = require('../functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('../functions/user-info-evaluate-functions.js').getImageSource;
const convertToFullWeekday = require('../functions/time-functions.js').convertToFullWeekday;
const getTimeInterval = require('../functions/time-functions.js').getTimeInterval;
const isMorning =require('../functions/time-functions.js'). isMorning;
const getOccupyingUserID = require('../functions/time-functions.js').getOccupyingUserID;
const isUserNull = require('../functions/time-functions.js').isUserNull;
const isMorningInterval = require('../functions/time-functions.js').isMorningInterval;
const isAfternoonInterval = require('../functions/time-functions.js').isAfternoonInterval;

let currentId = 6;
function generateUniqueRandomNumber(min, max) {
  currentId++;
  return currentId.toString().padStart(6, '0');
}



 reserveRouter.get('/reserve', async function(req, resp){
   console.log("Loaded");
   try {

       //excludes admin Users
       await updateLabInformation();
       const users = await usersModel.find({});
       const labs = await labModel.find({});
       var imageSource =  getImageSource(req.session.user.imageSource);

       // Check if users array is empty
       if (users.length === 0) {
         console.log("No users found in the database.");
       } else {
         console.log("Found", users.length, "users:"); // Print the number of users
       }
         // Optionally, print specific user details (be mindful of privacy)
         for (const user of users) {
           console.log("  - Username:", user.username); // Replace with relevant properties
       }

       if(labs.length != 0){
         console.log(JSON.stringify(labs));
       }else{
         console.log("cannot find labs data");
       }

       resp.render('html-pages/LT/LT-make-reservation', {
         layout: 'LT/index-LT-make-reservation',
         title: 'Tech Reserve ',
         name: req.session.user.username,
         imageSource: imageSource,
         techID: req.session.user.dlsuID,
         dlsuID: req.session.user.dlsuID,
         userType: 'lt-user',
         users: JSON.parse(JSON.stringify(users)), // Pass the list of users to the template
         labs: JSON.parse(JSON.stringify(labs)),
         helpers: {
           isAvailable: function (string) { return string === 'AVAILABLE'; }
         }
       });



     } catch (error) {
       console.error("Error retrieving users:", error);

     }
 });


 reserveRouter.post('/reserve', async function(req, resp){
   // console.log("Received from ajax", req.body);
   const { roomName, userID  } = req.body;
   // console.log("Post requested " + userID + " and " + roomName);


   if (roomName === 'N/A') {
     resp.status(400).json({ error: 'Room Name is missing' });
   } else {
     console.log("Sent url: " +`/lt-user/${req.session.user.dlsuID}/reserve/${userID}/${roomName}`);
     resp.send({ redirect: `/lt-user/${req.session.user.dlsuID}/reserve/${userID}/${roomName}` });
   }
 });



const searchUserRouter = require('../search-user');
reserveRouter.use("/", searchUserRouter);
const userReserveRouter = require('../userReserve.js');
reserveRouter.use("/", userReserveRouter );
module.exports = reserveRouter;
