

const Handlebars = require('handlebars');
const express = require("express");
const searchUserRouter = express.Router()
const labModel = require("../models/lab-model").LabModel;
const SeatModel = require("../models/lab-model").SeatModel;
const roomModel = require('../models/chat-model').roomModel;
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

//chatroom create
//----------------------
searchUserRouter.post('/:id/create-room', function(req, resp){

  userModel.find().lean().then(function(users){

    var user_userName = ''; // my username
    for(let i = 0; i < users.length; i++)
    {
      if(users[i].dlsuID === Number(req.body.user_dlsuID))
      {
        user_userName = users[i].username; // my username
      }
    }

    var other_userName = req.body.other_userName
    
    console.log("index:" + req.body.index);

    roomModel.find().lean().then(function(rooms){ // gets all the rooms

      var existingRoom = false;
      for(let i = 0; i<rooms.length; i++){
        if(((rooms[i].roomDetails[0].userName == user_userName) && (rooms[i].roomDetails[1].userName == other_userName)) ||
           ((rooms[i].roomDetails[0].userName == other_userName) && (rooms[i].roomDetails[1].userName == user_userName))){ // room exists
            existingRoom = true;
          }
      }

      if(!existingRoom && (other_userName != user_userName)){ // if nothing found/other user is not self, creates a room
        var new_roomID = rooms.length + 1001;

        var new_room = new roomModel({
          roomID : new_roomID,
          roomDetails : [
            {
              dlsuID: req.body.user_dlsuID,
              userName: user_userName,
              imageSource: req.body.user_imageSource
            },
            {
              dlsuID: req.body.other_dlsuID,
              userName: req.body.other_userName,
              imageSource: req.body.other_imageSource
            }
          ],
          dlsuID : [req.body.user_dlsuID, req.body.other_dlsuID],
        });
    
        new_room.save().then(function(){
    
          resp.send({
            msg: "room created with " + req.body.other_userName 
          });//resp send
    
        });//roommodel save
      }// if
      else{ // existing room or creating room with self
        resp.send({
          msg: "room exists or trying to create a room with self"
        });//resp send
      }
      
  
    });//roommodel find

  });//usermodel find

});//chatRouter
//----------------------
//chatroom create


searchUserRouter.get("/:id/search-users",  function(req, resp){
    var userString = req.params.id;
    var userType =  getUserType(userString);
    var imageSource =  getImageSource(req.session.user.imageSource);

    console.log("Session Data: " + JSON.stringify(req.session));
    resp.render('html-pages/search/search-user',{
        layout: "user/index-user",
        title: "Search User",
        userType: userType,
        dlsuID: req.params.id,
        name:  `${req.session.user.firstName} ${req.session.user.middleInitial} ${req.session.user.lastName}`,
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
            name:  `${req.session.user.firstName} ${req.session.user.middleInitial} ${req.session.user.lastName}`,
            userType: "user",
            imageSource:imageSource
        }); // render & page
    }); // then & func
});

searchUserRouter.get("/profile/:id",  async function(req, resp){
  allUniqueTimes = await initializeUniqueTimes();
  const reservations = await Reservation.find({ userID: req.params.id });
  var userString = req.params.id;
  const dlsuID = req.params.id;
  const searchQuery = { dlsuID: dlsuID };
  //var userType =  getUserType(userString);
  var imageSource =  getImageSource(req.session.user.imageSource);
  var profile = await userModel.findOne(searchQuery);
  var imageSourceProfile =  getImageSource(profile.imageSource);
  const seats = await getReservationJSON(reservations);


   console.log("Json of seats: ", seats);
    console.log("Attempting to load" + req.params.id);
    console.log("Logged in as")
    console.log(req.session.user)
    console.log("found profile")
    console.log(profile)


    console.log("Session Data: " + JSON.stringify(req.session));
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
        name:  `${req.session.user.firstName} ${req.session.user.middleInitial} ${req.session.user.lastName}`,
        email: profile.email

    });


});


searchUserRouter.post("/search-users", async function(req, resp){

      users_array = [];
      try{
          const filter = {};
          const users = await userModel.find(filter);


          if (req.body.msg){
              users.forEach(function(user){
                let stringID =(user.dlsuID).toString()
                  if(stringID.includes(req.body.msg)){
                      const response = {
                          user: user

                      }
                      users_array.push(response);
                  }
              });
              console.log("Selecting these particular arrays ");
              console.log(users_array)
              const response = {
                  users: JSON.parse(JSON.stringify(users_array)),
                  techID: req.session.user.dlsuID


              }
              console.log("Response sent to the server:")
              console.log(response);
              resp.send(response);
          }
          else{
            console.log("Triggering seacrh body empty case")

              users.forEach(function(user){

                  const response = {
                      user: user
                  }
                  users_array.push(response);
              });
              const response = {
                  users: JSON.parse(JSON.stringify(users_array)),
                  techID: req.session.user.dlsuID

              }
              console.log("Response sent to the server:")
              console.log(response);
              resp.send(response);
          }
      }
      catch (error) {
          console.error("Error during getting users:", error);
          resp.status(500).send({ error: "Internal server error" });
      }
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
Handlebars.registerHelper('isNotAnon', function (isAnon, options) {
    return isAnon === false ? options.fn(this) : options.inverse(this);
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


