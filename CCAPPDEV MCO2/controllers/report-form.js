const Handlebars = require('handlebars');
const express = require("express");
const reportFormRouter = express.Router()
const labModel = require("../models/lab-model").LabModel;
const SeatModel = require("../models/lab-model").SeatModel;
const reportModel = require("../models/report-model");
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

console.log("Connecteed to router report-form")

reportFormRouter.get("/:id/report-form",  function(req, resp){
    var userString = req.params.id;
    var userType =  getUserType(userString);

    resp.render('html-pages/report/report-form',{
        layout: "report/index-user-report",
        title: "Report an issue",
        userType: userType
    }); // render & page
});

reportFormRouter.post('/:id/send-form', async (req, resp) => {

    try {
      const form = {
        type : req.body.type,
        description : req.body.description,
        submitterID : req.params.id,
      };
  
      const reportInstance = await reportModel.create(form)
  
  
      console.log("Before saving:", reportInstance.toObject()); // Log object before saving
  
      reportInstance.save().then(function()
      {
        console.log('Form sent');
        alert("Form sent successfully!");
        //resp.redirect('/:id');
  
      });
      console.log("Saved Form:", reportInstance.toObject()); // Log object after saving
  
      // console.log(info);
  
    } catch (e) {
  
      console.log('Form not sent');
      alert("Form was not sent, please try again");
      console.error(e);
      console.error("Error:" + e.stack);
      resp.redirect("/report-form");
  
    }
    console.log("Received post request and form logged");
  
  
  
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

module.exports = reportFormRouter
