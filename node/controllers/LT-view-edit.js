const express = require("express");
const bcrypt = require('bcrypt');
const viewEditRouter = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../models/register-model");
const labModel = require("../models/labs-model").LabModel;
const reservationModel = require("../models/reserve-model");


 viewEditRouter.get('/view', async function(req, resp){
   console.log("Loaded");

   try {

     const reservations = await reservationModel.find({}).sort({ reservationStatus: 1 });;

     resp.render('html-pages/LT/LT-reserve-view', {
       layout: 'index-lt-user-view-edit',
       title: 'Tech Reservations View',
       name: req.session.user.username,
       redirectBase: "/lt-user/"+req.session.user.dlsuID+"/view/",
       reservations: JSON.parse(JSON.stringify(reservations)),
       helpers: {
         isOngoing: function (string) { return string === 'Ongoing'; },
       }
     });



   } catch (e) {
      console.error("Error retrieving users:", e);
   }

 });


 viewEditRouter.get('/view/:resID', async function(req, resp){
   console.log("Loaded");

   // try {
   //
   //   const reservations = await reservationModel.find({}).sort({ reservationStatus: 1 });;
   //
   //   resp.render('html-pages/LT/LT-reserve-view', {
   //     layout: 'index-lt-user-view-edit',
   //     title: 'Tech Reservations View',
   //     name: req.session.user.username,
   //     redirectBase: "/lt-user/"+req.session.user.dlsuID+"/view/",
   //     reservations: JSON.parse(JSON.stringify(reservations)),
   //     helpers: {
   //       isOngoing: function (string) { return string === 'Ongoing'; },
   //     }
   //   });
   //
   //
   //
   // } catch (e) {
   //    console.error("Error retrieving users:", e);
   // }

 });

module.exports = viewEditRouter;
