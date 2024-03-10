const express = require("express");
const bcrypt = require('bcrypt');
const reserveRouter = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../models/register-model");
const labModel = require("../models/labs-model").LabModel;
const seatModel = require("../models/labs-model").SeatModel;
const segregateSeats = require("../models/labs-model").segregateSeats;
const getSeatTimeRange = require("../models/labs-model").getSeatTimeRange;
const timeModel = require("../models/time-model");
const updateLabInformation = require("../models/labs-model").updateLabInformation;



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



       resp.render('html-pages/LT/LT-make-reserve', {
         layout: 'index-lt-user-2',
         title: 'Tech Reserve ',
         name: req.session.user.username,
         techID: req.session.user.dlsuID,
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
   console.log("Received from ajax", req.body);
   const { roomName, userID  } = req.body;
   console.log("Post requested " + userID + " and " + roomName);


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


         resp.render('html-pages/reserve/reserve', {
           layout: 'index-lt-user-reserve-user',
           title: 'Tech Reserve User ' + user.dlsuID,
           name: req.session.user.username,
           techID: req.session.user.dlsuID,
           userID: req.params.userID,
           labName: labRoom,
           postURL:`/lt-user/${req.session.user.dlsuID}/reserve/${user.dlsuID}/${labRoom}`,

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
 reserveRouter.post('/reserve/:userID/:labRoom', async function(req, resp){
       const seats = await seatModel.find({weekDay: req.body.day, labName:req.params.labRoom})

       const grouped_seats = segregateSeats(seats);
       resp.send({data: grouped_seats});
      console.log(grouped_seats);
 });

module.exports = reserveRouter;
