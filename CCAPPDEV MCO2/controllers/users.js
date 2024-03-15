

const Handlebars = require('handlebars'); // Assuming Handlebars is included
const express = require("express");
const userRouter = express.Router();
const labModel = require("../models/lab-model").LabModel;
const SeatModel = require("../models/lab-model").SeatModel;
const Reservation = require("../models/reserve-model");
const segregateSeats = require("../models/lab-model").segregateSeats;
const getUniqueSeatNumbers = require("../models/lab-model").getUniqueSeatNumbers
const getSeatTimeRange = require("../models/lab-model").getSeatTimeRange;
const MAX_RESERVED_SEATS_VISIBLE = 3;
const reservationModel = require("../models/reserve-model");
const Time = require("../models/time-model");
const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekdaysShort = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
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


 async function getSeatDate(weekday) {
   const today = new Date();


   while (today.getDay() !== weekdaysFull.indexOf(weekday)) {
     today.setDate(today.getDate() + 1);
   }

   return today;
 }


 Handlebars.registerHelper('eq', function (a, b, options) {
   return a === b ? options.fn(this) : options.inverse(this);
 });
 Handlebars.registerHelper('length', function (value) {
   if (typeof value === 'string') {
     return value.length; // Handle strings
   } else if (Array.isArray(value)) {
     return value.length; // Handle arrays
   } else {
     return 0; // Handle other data types (return 0 for non-strings or arrays)
   }
 });

 Handlebars.registerHelper('gte', function (value1, value2) {
  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return value1 >= value2;
  } else {
    return false; // Handle non-numeric values or invalid comparisons
  }
});

Handlebars.registerHelper('limitEach', function (array, limit, options) {
  const subArray = array.slice(0, limit);
  return options.fn(subArray);
});



async function getAllReservationDetails(userID){
  initializeUniqueTimes();
  try {
  const reservations = await Reservation.find({ userID: userID });
  const seats = {};

  for (const reservation of reservations) {
    for (const reservationSeatId of reservation.reservationSeats) {

        // Find the seat document and handle potential errors
        const seat = await SeatModel.findById(reservationSeatId);
        if (!seat) {
          console.log(`Seat not found for reservation seat ID: ${reservationSeatId}`);
          continue;
        }


        const seatDetails = {
          _id: seat._id,
          seatNumber: seat.seatNumber,
          date: formatWeekdayDate(seat.weekDay),
          timeInterval: await getSeatTimeRange(seat.seatTimeID),
          labName: seat.labName, // Include if needed
        };


        const today = new Date();
        const seatDate = await getSeatDate(seat.weekDay);

        const daysDifference = Math.floor((seatDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const group = `next_day_${Math.max(0, daysDifference)}`;


        if (!seats[group]) {
          seats[group] = [];
        }


        //Limits the seats the user can view
        if (seats[group].length < MAX_RESERVED_SEATS_VISIBLE) {
          seats[group].push(seatDetails);
        }


      }
    }
  }
  catch (error) {
    console.error(`Error fetching seat details for seat ID: ${reservationSeatId}`, error);
  }

  return seats
}
userRouter.get("/:id",  async function(req, resp){

  var abtMe;
  var course;
  var imageSource;

  var seats = await getAllReservationDetails(req.params.id);
    var uid = req.session.user.dlsuID;
  console.log("Json of seats: ", seats);


  console.log("Attempting to load" + req.params.id);
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

    resp.render('html-pages/user/U-user',{
        layout: 'user/index-user',
        title: req.session.user['username'],
        userType: 'user',
        course: course,
        imageSource: imageSource,
        about: abtMe,
        seats: JSON.parse(JSON.stringify(seats)),
        name:  `${req.session.user.firstName} ${req.session.user.middleInitial} ${req.session.user.lastName}`,
        redirectReserve: `/user/${uid}/reservations/view`,
        id: req.session.user['dlsuID'],
        dlsuID: req.session.user['dlsuID']

    });
  }

});



userRouter.get("/:id/reservations/view",  async function(req, resp){


  console.log("Loaded");
  console.log("Welcome to viewing reservation user: " + req.session.user.dlsuID);

  var imageSource;
  if(req.session.user.imageSource){
    imageSource = req.session.user.imageSource
  }else{
    imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
  }
  try {

    const reservations = await Reservation.find({userID: req.params.id}).sort({ reservationStatus: 1 });;
    var uid = req.session.user.dlsuID;
    resp.render('html-pages/user/user-view-reservations', {
      layout: 'user/index-user-view-reservations',
      title: 'User Reservations View',
      userType: 'user',
      name: req.session.user.username,
      imageSource: imageSource,
      dlsuID: uid,
      redirectBase: `/user/${uid}/reservations/view`,
      reservations: JSON.parse(JSON.stringify(reservations)),
      helpers: {
        isOngoing: function (string) { return string === 'Ongoing'; },

      }
    });



  } catch (e) {
     console.error("Error retrieving users:", e);
  }

});





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
userRouter.get("/:id/reservations/view/:resID",  async function(req, resp){


  try {


    await initializeUniqueTimes(); // Wait for initialization
    const labSeatsMap = await keyLabNamesToSeatIds(req.params.resID);
    console.log(labSeatsMap);


    console.log(labSeatsMap);
    var imageSource;
    if(req.session.user.imageSource){
      imageSource = req.session.user.imageSource
    }else{
      imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
    }
      resp.render('html-pages/user/user-reservation-data', {
        layout: 'user/index-user-view-reservations',
        title: 'Tech Reservations View',
        name: req.session.user.username,
        imageSource:imageSource,
        data: labSeatsMap,
        userType: 'user',
        dlsuID: req.session.user.dlsuID,
        redirectBase: "/user/"+req.session.user.dlsuID+`/view/${req.params.resID}`,
        helpers: {
          isOngoing: function (string) { return string === 'Ongoing'; }
        }
      });
  } catch(error) {
    console.error("Error in route handler:", error);

  }
});

const searchUserRouter = require('./search-user');
userRouter.use("/", searchUserRouter);

const searchLabRouter = require('./search-lab');
userRouter.use("/", searchLabRouter);

module.exports = userRouter
module.exports.getAllReservationDetails = getAllReservationDetails;
