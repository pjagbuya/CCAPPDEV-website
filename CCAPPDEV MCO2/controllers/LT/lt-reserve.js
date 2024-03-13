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
let currentId = 6;

function generateShortId() {
  currentId++;
  return currentId.toString().padStart(6, '0');
}


 reserveRouter.get('/reserve', async function(req, resp){
   console.log("Loaded");
   try {

       //excludes admin Users
       await updateLabInformation();
       const users = await  usersModel.find({dlsuID: { $regex: /^(?!.*101).*$/ }});
       const labs = await labModel.find({});

       // Check if users array is empty
       if (users.length === 0) {
         console.log("No users found in the database.");
       } else {
         console.log("Found", users.length, "users:"); // Print the number of users

         // Optionally, print specific user details (be mindful of privacy)
         for (const user of users) {
           console.log("  - Username:", user.username); // Replace with relevant properties
         }
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
     console.log("Sent url: " +`/lt-user/${req.session.user.dlsuID}/reserve/${userID}/${roomName}`)
     resp.send({ redirect: `/lt-user/${req.session.user.dlsuID}/reserve/${userID}/${roomName}` });
   }
 });


 reserveRouter.get('/reserve/:userID/:labRoom', async function(req, resp){

   try {


       try {

         //excludes admin Users
         await updateLabInformation();

         const { dlsuID, labRoom } = req.params;

         const user = await usersModel.findOne({ dlsuID: req.params.userID });
         console.log('User Data:', user);

         const labs = await labModel.findOne({ labName: labRoom });
         console.log('Lab Data:', labs);



         //
         // console.log(grouped_seats);


         resp.render('html-pages/reserve/LT-reserve-func', {
           layout: 'LT/index-LT-reserve-func',
           title: 'Tech Reserve User ' + user.dlsuID,
           name: req.session.user.username,
           techID: req.session.user.dlsuID,
           userID: req.params.userID,
           labName: labRoom,
           userType: 'lt-user',
           postURL:`/lt-user/${req.session.user.dlsuID}/reserve/${user.dlsuID}/${labRoom}`,
           confirmedURL:`/lt-user/${req.session.user.dlsuID}/reserve`,
           helpers: {
             getSeatTimeRange: getSeatTimeRange,

           }
         });

       } catch (error) {
         console.error('Error loading data:', error);
         // Handle the error (e.g., send an error response to the client)
       }




     } catch (error) {
       console.error("Error retrieving users:", error);

     }
 });


 reserveRouter.post('/reserve/confirm', async function(req, resp){


   const { userID, labName, seatSlots } = req.body;

   console.log("received this user "+ "userID");

   try {

     const seats = await seatModel.find({ _id: { $in: seatSlots } });

     const occupiedSeats = seats.filter(seat => seat.studentUser !== null);
     if (occupiedSeats.length > 0) {
       return res.status(400).json({ error: 'Some of your chosen seats are already reserved' });
     }
     const updatePromises = seats.map(seat => {
       seat.studentUser = userID;
       return seat.save();
     });

     await Promise.all(updatePromises);


     const reservation = new Reservation({
       reservationID: String(generateShortId()),
       userID: userID,
       reservationSeats: seatSlots,
       reservationStatus: "Upcoming"
     });

     console.log("Saving the following details as reservation: " + reservation)

     await reservation.save();

     resp.status(200).json({ message: 'Seats updated and reservation created!' });
   } catch (error) {
     console.error('Error:', error);
     resp.status(500).json({ error: 'Something went wrong' });
   }
 });
 reserveRouter.post('/reserve/:userID/:labRoom', async function(req, resp){
        console.log(req.url)
        console.log("In reserve/userID/labRoom url")
        const day = req.body?.day;
       if (day === undefined) {
         resp.status(400).send({ error: "Missing 'day' in request body" });
         return
       }

       const seats = await seatModel.find({weekDay: req.body.day, labName:req.params.labRoom})
       console.log("Finding the " + req.body.day)
       const grouped_seats = segregateSeats(seats);

       var seatNumberSet = new Set();

       for (const subgroup of grouped_seats[req.body.day]) {
         const uniqueSeatNumbers = getUniqueSeatNumbers(subgroup.seats);
         uniqueSeatNumbers.forEach(seatNumber => {seatNumberSet.add(seatNumber)});

       }

      var uniqueSeatNumbersArray = Array.from(seatNumberSet);
       console.log("Seats found: " + uniqueSeatNumbersArray);
       resp.send({
         data: uniqueSeatNumbersArray
       });

 });
 async function getOccupyingUserID(timeID, day, labName, seatNumber) {
   try {
     const occupiedSeat = await seatModel.findOne({
       seatNumber,
       weekDay: day,
       labName,
       seatTimeID: timeID,
       studentUser: { $exists: true }
     });

     return occupiedSeat ? occupiedSeat.studentUser : null;
   } catch (error) {
     console.error('Error:', error);
     return null;
   }
 }
 function isUserNull(user) {
   return user === null;
 }
 function isMorning(timeInterval) {
   const twelveThirty = '12:30';

   return timeInterval.timeOUT < twelveThirty;
 }

 function getTimeInterval(timeIntervals, seatTimeID) {
   const time = timeIntervals.find(time => time.timeID === seatTimeID);
   return time ? `${time.timeIN} - ${time.timeOUT}` : '';
 }
 function convertToFullWeekday(shorthand) {
  const weekdaysMap = {
    'Sun': 'Sunday',
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
  };

  return weekdaysMap[shorthand] || shorthand;
}



function isMorningInterval(timeInterval) {
  const startTime = timeInterval.split(' - ')[0];
  return startTime < '12:00';
}

function isAfternoonInterval(timeInterval) {
  const startTime = timeInterval.split(' - ')[0];
  return startTime >= '12:00' && startTime < '17:00';
}

 reserveRouter.post('/reserve/seat', async function(req, resp){

   try {
     const { weekDay, labName, seatNumber } = req.body;
     console.log("Selected Day: " + weekDay);
     console.log("labName:", labName);
     console.log("seatNumber:", seatNumber);
     console.log("Request body has returned " + JSON.parse(JSON.stringify(req.body)) );


     // Assuming seatNumber is an array
     const seats = await seatModel.find({
       weekDay: convertToFullWeekday(weekDay),
       labName: labName,
       seatNumber: { $in: seatNumber }
     });

     const seatTimeIDs = seats.map(seat => seat.seatTimeID);



     const timeIntervals = await timeModel.find({
       timeID: { $in: seatTimeIDs }
     });

     console.log("Seat Time IDs" + seatTimeIDs);

     const seatTimeIntervals = seats.map(seat => ({
       _id: seat._id,
       seatTimeID: seat.seatTimeID,
       studentUser: seat.studentUser,
       timeInterval: getTimeInterval(timeIntervals, seat.seatTimeID)
     }));


     const morningIntervals = seatTimeIntervals.filter(seat => isMorningInterval(seat.timeInterval));
     const afternoonIntervals = seatTimeIntervals.filter(seat => isAfternoonInterval(seat.timeInterval));

     resp.send({ dataM: morningIntervals,
                 dataN: afternoonIntervals
                });
     console.log("Seat time intervals of seat", seatTimeIntervals);
     console.log("Morning scheds ", morningIntervals);
     console.log("Afternoon scheds ", afternoonIntervals);


   } catch (error) {
     console.error('Error:', error);
     resp.status(500).json({ error: 'Internal Server Error' });
   }
});

const searchUserRouter = require('../search-user');
reserveRouter.use("/search-user", searchUserRouter);

module.exports = reserveRouter;
