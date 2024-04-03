

const Handlebars = require('handlebars'); // Assuming Handlebars is included
const express = require("express");
const userRouter = express.Router();
const labModel = require("../models/lab-model").LabModel;
const SeatModel = require("../models/lab-model").SeatModel;
const Reservation = require("../models/reserve-model");
const segregateSeats = require("../models/lab-model").segregateSeats;
const getUniqueSeatNumbers = require("../models/lab-model").getUniqueSeatNumbers
const getSeatTimeRange = require("../models/lab-model").getSeatTimeRange;

const reservationModel = require("../models/reserve-model");
const Time = require("../models/time-model");
const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekdaysShort = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const initializeUniqueTimes = require("./functions/time-functions.js").initializeUniqueTimes;
const formatWeekdayDate = require("./functions/time-functions.js").formatWeekdayDate;
const convertTimeIdToInterval = require("./functions/time-functions.js").convertTimeIdToInterval;
const keyLabNamesToSeatIds = require("./functions/time-functions.js").keyLabNamesToSeatIds;
const getUserType = require('./functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('./functions/user-info-evaluate-functions.js').getImageSource;
const getSeatDate = require('./functions/time-functions.js').getSeatDate;
const getReservationJSON = require('./functions/reservations-to-json.js').getReservationJSON
const getUserAbtMe = require('./functions/user-info-evaluate-functions.js').getUserAbtMe;
const getCourse = require('./functions/user-info-evaluate-functions.js').getCourse;


var allUniqueTimes;






// Regular Student User Profile
userRouter.get("/:id",  async function(req, resp){

  var abtMe = getUserAbtMe(req.session.user.about);
  var course = getCourse(req.session.user.course);
  var imageSource=  getImageSource(req.session.user.imageSource);
  const reservations = await Reservation.find({userID: req.params.id});
  var seats = await getReservationJSON(reservations);
  var uid = req.session.user.dlsuID;
  console.log("Reservations found", reservations);
  console.log("Json of seats: ", seats);


  console.log("Attempting to load" + req.params.id);
  if(req.session.user){
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
        dlsuID: req.session.user['dlsuID'],
        helper:{
          isNull: function(value){
            if(value)
            {
              return false
            }else{
              return true
            }
          }
        }

    });
  }

});


// Route for the user to view reservation
userRouter.get("/:id/reservations/view",  async function(req, resp){


  console.log("Loaded");
  console.log("Welcome to viewing reservation user: " + req.session.user.dlsuID);

  var imageSource=  getImageSource(req.session.user.imageSource);

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


// Route for the user to view reservations
userRouter.get("/:id/reservations/view/:resID",  async function(req, resp){


  try {


    allUniqueTimes = await initializeUniqueTimes(); // Wait for initialization
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

Handlebars.registerHelper('isNull', function (value) {
  return value === undefined || value === null; // Concise check for null or undefined
});

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

const userReserveRouter = require('./userReserve.js');
userRouter.use("/", userReserveRouter );

const searchUserRouter = require('./search-user');
userRouter.use("/", searchUserRouter);

const searchLabRouter = require('./search-lab');
userRouter.use("/", searchLabRouter);

module.exports = userRouter
