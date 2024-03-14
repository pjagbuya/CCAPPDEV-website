

const Handlebars = require('handlebars');
const express = require("express");
const searchUserRouter = express.Router();

const labModel = require("../models/lab-model").LabModel;
const SeatModel = require("../models/lab-model").SeatModel;
const Reservation = require("../models/reserve-model");
const segregateSeats = require("../models/lab-model").segregateSeats;
const getUniqueSeatNumbers = require("../models/lab-model").getUniqueSeatNumbers
const getSeatTimeRange = require("../models/lab-model").getSeatTimeRange;
const MAX_RESERVED_SEATS_VISIBLE = 3;
const Time = require("../models/time-model");
const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekdaysShort = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

// model Imports
const userModel = require('../models/register-model');



console.log("Connecteed to router 3")
// Start her after template above

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

searchUserRouter.get("/:id/search-users",  function(req, resp){ 
    var userString = req.params.id;
    var userType = "";

    if(userString === "101"){
        userType = "lt-user";
    }else{ userType = "user"; }

    resp.render('html-pages/search/search-user',{
        layout: "user/index-user",
        title: "Search User",
        userType: userType,
        dlsuID: req.params.id
    }); // render & page
});


searchUserRouter.post("/:id/search-user-results",  function(req, resp){
    const searchQuery = { };

    // builds onto the searchQuery object based on filled fields
    // searches all if nothing is filled
    if (req.body.username && req.body.username.trim() !== ''){
        searchQuery.username = req.body.username.trim();
    }
    if (req.body.dlsuID && req.body.dlsuID.trim() !== ''){
        searchQuery.dlsuID = req.body.dlsuID.trim();
    }
    if (req.body.firstname && req.body.firstname.trim() !== ''){
        searchQuery.firstname = req.body.firstname.trim();
    }
    if (req.body.lastname && req.body.lastname.trim() !== ''){
        searchQuery.lastname = req.body.lastname.trim();
    }


    userModel.find(searchQuery).lean().then(function(users){
        resp.render('html-pages/search/search-user-results',{
            layout: "user/index-user",
            title: "User Search Results",
            users: users,
            dlsuID: req.params.id
        }); // render & page
    }); // then & func
});

searchUserRouter.get("/profile/:id",  async function(req, resp){
    initializeUniqueTimes();
    const reservations = await Reservation.find({ userID: req.params.id });
    const seats = {};
    const dlsuID = req.params.id;
    const searchQuery = { dlsuID: dlsuID };
  
    // Loop through each reservation and its associated seat IDs
    // Each seat IDs is segregated via key pattern "next_day_0, next_day_1"
    // Loop through each reservation and its associated seat IDs
    for (const reservation of reservations) {
      for (const reservationSeatId of reservation.reservationSeats) {
        try {
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
  
        } catch (error) {
          console.error(`Error fetching seat details for seat ID: ${reservationSeatId}`, error);
        }
      }
    }
    console.log("Json of seats: ", seats);
  
  
    console.log("Attempting to load" + req.params.id);
      console.log("Logged in as")
      console.log(req.session.user)
      profile = await userModel.findOne(searchQuery)
        console.log("found profile")
        console.log(profile)
        resp.render('html-pages/search/search-user-view',{
            layout: "user/index-user",
            title: "User Search Results",
            seats: JSON.parse(JSON.stringify(seats)),
            profile: profile, 
            firstName: profile.firstName,  
            lastName: profile.lastName, 
            view_dlsuID: profile.dlsuID, // for the viewed profile
            email: profile.email, 
            dlsuID: req.params.id // user's own dlsuID
            
        }); // render & page
  });

// for loading the search result
// searchUserRouter.get("/profile/:id",  function(req, resp){ 
//     const dlsuID = req.params.id;
//     const searchQuery = { dlsuID: dlsuID };

//     userModel.find(searchQuery).lean().then(function(profile){
//         resp.render('html-pages/search/search-user-view',{
//             layout: "user/index-user",
//             title: "User Search Results",
//             profile: profile,   
//             dlsuID: req.params.id
            
//         }); // render & page
//     }); // then & func
// });




//  Routing to next search result-page insert here, sample given below
// const searchRouter = require('./search-user'); //file name
// userRouter.use("/search-user", searchRouter); //route name



module.exports = searchUserRouter
