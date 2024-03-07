const express = require("express");
const bcrypt = require('bcrypt');
const reserveRouter = express.Router();
const mongoos = require("mongoose");
 const usersModel = require("../models/register-model");

//
//
// reserveRouter.get('/', async function(req, resp){
//   console.log("Loaded")
//   try {
//       const users = await usersModel.find({});
//       console.log("Retrieved users:", users); // Print the entire user array
//
//       // Check if users array is empty
//       if (users.length === 0) {
//         console.log("No users found in the database.");
//       } else {
//         console.log("Found", users.length, "users:"); // Print the number of users
//
//         // Optionally, print specific user details (be mindful of privacy)
//         for (const user of users) {
//           console.log("  - Username:", user.username); // Replace with relevant properties
//         }
//       }
//
//       resp.render('html-pages/LT/LT-make-reserve', {
//         layout: 'index-lt-user-2',
//         title: 'Tech Reserve ',
//         name: req.session.user.username,
//         users: users // Pass the list of users to the template
//       });
//     } catch (error) {
//       console.error("Error retrieving users:", error);
//       // Handle errors appropriately (e.g., send an error response to the client)
//     }
// })

module.exports = reserveRouter
