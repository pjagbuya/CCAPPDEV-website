const express = require("express");
const bcrypt = require('bcrypt');
const reserveRouter = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../models/register-model");
const labModel = require("../models/labs-model").LabModel;
const SeatModel = require("../models/labs-model").SeatModel;
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



       const newSeat = new SeatModel({
         labName: 'GK301', // Add other necessary properties
         weekDay: 'Monday',
         seatNumber: '041',
         seatTimeID: 1,
       });
         await newSeat.save();
         console.log('Seat saved successfully!');

         await SeatModel.deleteOne({ _id: newSeat._id });
         console.log('Seat deleted successfully!');



       resp.render('html-pages/LT/LT-make-reserve', {
         layout: 'index-lt-user-2',
         title: 'Tech Reserve ',
         name: req.session.user.username,
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

module.exports = reserveRouter;
