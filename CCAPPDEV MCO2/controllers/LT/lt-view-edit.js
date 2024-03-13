const express = require("express");
const bcrypt = require('bcrypt');
const viewEditRouter = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../../models/register-model");
const labModel = require("../../models/labs-model").LabModel;
const reservationModel = require("../../models/reserve-model");
const Time = require("../../models/time-model");
var allUniqueTimes;
async function initializeUniqueTimes() {
  const uniqueTimeIds = await Time.distinct('timeID', { timeID: { $gte: 1, $lte: 20 } });

  const timeData = await Time.find({ timeID: { $in: uniqueTimeIds } })

  allUniqueTimes = timeData.map(({ timeID, timeIN, timeOUT }) => ({
    timeId: timeID,
    timeInterval: `${timeIN} - ${timeOUT}`
  }));
}
 function formatWeekdayDate(weekday) {
   const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   const weekdaysShort = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

   const today = new Date();
   let currentWeekdayIndex = today.getDay();


   if (!weekdaysFull.includes(weekday)) {
     throw new Error('Invalid weekday provided');
   }

   const targetWeekdayIndex = weekdaysFull.indexOf(weekday);

   let daysToAdd = (targetWeekdayIndex - currentWeekdayIndex + 7) % 7;
   if (daysToAdd === 0 && currentWeekdayIndex === targetWeekdayIndex) {
     daysToAdd = 0;
   }

   const targetDate = new Date();
   targetDate.setDate(today.getDate() + daysToAdd);


   const shortWeekday = weekdaysShort[targetDate.getDay()];

   const formattedDate = `${shortWeekday}, ${targetDate.toDateString().split(' ')[1]} ${targetDate.getDate()}`;

   return formattedDate;
 }
function convertTimeIdToInterval(timeId) {
   const matchingTime = allUniqueTimes.find(timeData => timeData.timeId === timeId);

   if (matchingTime) {
     return matchingTime.timeInterval;
   } else {
     return 'Time Interval Not Found';
   }
 }


 async function keyLabNamesToSeatIds(reservationIdValue, reservationIdField = 'reservationID') {
   try {
     const query = {};
     query[reservationIdField] = reservationIdValue;

     const reservation = await reservationModel.findOne(query)
       .populate('reservationSeats');

     const result = [];

     const seatsByLabName = {};
     const sortedSeats = reservation.reservationSeats.sort((seat1, seat2) => seat1.seatTimeID - seat2.seatTimeID);

     const labNamesToSeats = sortedSeats.reduce((acc, seat) => {
       const labName = seat.labName;

       if (!acc[labName]) {
         acc[labName] = {
           labName,
           firstSeat: null,
           otherSeats: [],
           totalSeats: 0
         };
       }

       const seatData = {
         seatId: seat._id,
         seatNumber: seat.seatNumber,
         weekDay: formatWeekdayDate(seat.weekDay),
         timeInterval: convertTimeIdToInterval(seat.seatTimeID)
       }

       if (!acc[labName].firstSeat) {
         acc[labName].firstSeat = seatData;
       } else {
         acc[labName].otherSeats.push(seatData);
       }

       acc[labName].totalSeats++;
       return acc;
     }, {});

     return Object.values(labNamesToSeats);
   } catch(error) {
     console.error("Error grouping seats:", error);
     throw error;
   }
 }

  viewEditRouter.get('/view', async function(req, resp){
    console.log("Loaded");
    console.log("Welcome to viewing reservation user: " + req.session.user.dlsuID);

    try {

      const reservations = await reservationModel.find({}).sort({ reservationStatus: 1 });;
      var uid = req.session.user.dlsuID;
      resp.render('html-pages/LT/LT-view-reservations', {
        layout: 'LT/index-LT-view-reservations',
        title: 'Tech Reservations View',
        userType: 'lt-user',
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
     await initializeUniqueTimes(); // Wait for initialization
     const labSeatsMap = await keyLabNamesToSeatIds(req.params.resID);
     console.log(labSeatsMap);

     console.log(labSeatsMap);

       resp.render('html-pages/LT/LT-reservation-data', {
         layout: 'LT/index-LT-view-reservations',
         title: 'Tech Reservations View',
         userType: 'lt-user',
         name: req.session.user.username,
         data: labSeatsMap,
         labName:labSeatsMap[0].labName,
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
 module.exports = {
   convertTimeIdToInterval,
   keyLabNamesToSeatIds,

 }
module.exports.viewEditRouter = viewEditRouter;
