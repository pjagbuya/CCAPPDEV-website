

const Handlebars = require('handlebars');
const express = require("express");
const searchUserRouter = express.Router()
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
const initializeUniqueTimes = require("./functions/time-functions.js").initializeUniqueTimes;
const formatWeekdayDate = require("./functions/time-functions.js").formatWeekdayDate;
const convertTimeIdToInterval = require("./functions/time-functions.js").convertTimeIdToInterval;
const keyLabNamesToSeatIds = require("./functions/time-functions.js").keyLabNamesToSeatIds;
const userModel = require('../models/register-model');
const getUserType = require('./functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('./functions/user-info-evaluate-functions.js').getImageSource;
const buildSearchUserQuery = require('./functions/user-info-evaluate-functions.js').buildSearchUserQuery
const getReservationJSON = require('./functions/reservations-to-json.js').getReservationJSON
const getSeatDate = require('./functions/time-functions.js').getSeatDate;
var allUniqueTimes;

console.log("Connecteed to router search-user")

searchUserRouter.get("/:id/search-users",  function(req, resp){
    var userString = req.params.id;
    var userType =  getUserType(userString);
    var imageSource =  getImageSource(req.session.user.imageSource);

    resp.render('html-pages/search/search-user',{
        layout: "user/index-user",
        title: "Search User",
        userType: userType,
        dlsuID: req.params.id,
        imageSource: imageSource
    }); // render & page
});


searchUserRouter.post("/:id/search-user-results",  function(req, resp){
    const searchQuery =  buildSearchUserQuery(req.body.username, req.body.dlsuID, req.body.firstname, req.body.lastname);
    var imageSource =  getImageSource(req.session.user.imageSource);

    userModel.find(searchQuery).lean().then(function(users){
        resp.render('html-pages/search/search-user-results',{
            layout: "user/index-user",
            title: "User Search Results",
            users: users,
            dlsuID: req.session.user.dlsuID,
            userType: "user",
            imageSource:imageSource
        }); // render & page
    }); // then & func
});

searchUserRouter.get("/profile/:id",  async function(req, resp){
  allUniqueTimes = await initializeUniqueTimes();
  const reservations = await Reservation.find({ userID: req.params.id });

  const dlsuID = req.params.id;
  const searchQuery = { dlsuID: dlsuID };
  var userType =  getUserType(userString);
  var imageSource =  getImageSource(req.session.user.imageSource);
  var profile = await userModel.findOne(searchQuery);
  var imageSourceProfile =  getImageSource(profile.imageSource);
  const seats = getReservationJSON(reservations);


   console.log("Json of seats: ", seats);
    console.log("Attempting to load" + req.params.id);
    console.log("Logged in as")
    console.log(req.session.user)
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
        imageSourceProfile:imageSourceProfile,
        imageSource:imageSource,
        userType: "user",
        dlsuID: req.session.user.dlsuID,
        email: profile.email

    });


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


Handlebars.registerHelper('startsWith101', function (string) {
 return (string+"").startsWith("101");
});

module.exports = searchUserRouter
