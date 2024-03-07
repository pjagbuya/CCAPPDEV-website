const express = require("express");
const bcrypt = require('bcrypt');
const ltRouter = express.Router();

const usersModel = require("../models/register-model");



ltRouter.get('/:id', function(req, resp){


    resp.render('html-pages/LT/LT-profile',{
        layout: 'index-lt-user',
        title: 'Tech ' + req.session.user.username,
        name: req.session.user.username,
        fullName: req.session.user.firstName +' ' +
                  req.session.user.middleInitial + ' ' +
                  req.session.user.lastName,
        dlsuID: req.session.user.dlsuID,
        email: req.session.user.email,
        redirectReserve: "/lt-user/" + req.session.user.dlsuID + "/reserve",
        redirectEdit: "/lt-user/" + req.session.user.dlsuID + "/reserve"

    });
});

ltRouter.get('/:id/reserve', async function(req, resp){
  console.log("Loaded")
  try {

      //excludes admin Users
      const users = await  usersModel.find({dlsuID: { $regex: /^(?!.*101).*$/ }});

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

      resp.render('html-pages/LT/LT-make-reserve', {
        layout: 'index-lt-user-2',
        title: 'Tech Reserve ',
        name: req.session.user.username,
        users: JSON.parse(JSON.stringify(users)) // Pass the list of users to the template
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      // Handle errors appropriately (e.g., send an error response to the client)
    }
})


const reserveRouter = require('./LT-reserve')
ltRouter.use(":id/reserve", reserveRouter);

module.exports = ltRouter
