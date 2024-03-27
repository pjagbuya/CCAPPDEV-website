


const Handlebars = require('handlebars'); // Assuming Handlebars is included
const express = require("express");
const userReserveRouter = express.Router();
const mongoose = require("mongoose");
const hbs = require("handlebars");
const usersModel = require("../models/register-model");
const labModel = require("../models/lab-model").LabModel;
const seatModel = require("../models/lab-model").SeatModel;
const Reservation = require("../models/reserve-model");
const segregateSeats = require("../models/lab-model").segregateSeats;
const getUniqueSeatNumbers = require("../models/lab-model").getUniqueSeatNumbers
const getSeatTimeRange = require("../models/lab-model").getSeatTimeRange;
const timeModel = require("../models/time-model");
const updateLabInformation = require("../models/lab-model").updateLabInformation;
const getUserType = require('./functions/user-info-evaluate-functions.js').getUserType;
const getImageSource = require('./functions/user-info-evaluate-functions.js').getImageSource;
const convertToFullWeekday = require('./functions/time-functions.js').convertToFullWeekday;
const getTimeInterval = require('./functions/time-functions.js').getTimeInterval;
const isMorning =require('./functions/time-functions.js'). isMorning;
const getOccupyingUserID = require('./functions/time-functions.js').getOccupyingUserID;
const isUserNull = require('./functions/time-functions.js').isUserNull;
const isMorningInterval = require('./functions/time-functions.js').isMorningInterval;
const isAfternoonInterval = require('./functions/time-functions.js').isAfternoonInterval;
const getReserveJSONtoLoad = require('./functions/user-info-evaluate-functions.js').getReserveJSONtoLoad;


userReserveRouter.get('/reserve/:userID/:labRoom', async function(req, resp){

  try {
      var imageSource =  getImageSource(req.session.user.imageSource);
      //excludes admin Users
      await updateLabInformation();

      const { dlsuID, labRoom } = req.params;

      const user = await usersModel.findOne({ dlsuID: req.params.userID });
      console.log('User Data:', user);

      const labs = await labModel.findOne({ labName: labRoom });
      console.log('Lab Data:', labs);

      const dataJSON = getReserveJSONtoLoad(req.session.user.username, req.session.user.dlsuID,
                                   user.dlsuID, labRoom,
                                   imageSource, getSeatTimeRange)

      resp.render('html-pages/reserve/LT-reserve-func', dataJSON);


    } catch (error) {
      console.error("Error retrieving users:", error);

    }
});


userReserveRouter.post('/reserve/confirm', async function(req, resp){


  const { userID, labName, seatSlots } = req.body;

  console.log("received this user "+ "userID");
  console.log("seat slots chosen");
  console.log(seatSlots)

  try {

    const seats = await seatModel.find({ _id: { $in: seatSlots } });

    const occupiedSeats = seats.filter(seat => seat.studentUser !== null);
    if (occupiedSeats.length > 0) {
      return res.status(400).json({ error: 'Some of your chosen seats are already reserved' });
    }
    const updatePromises = seats.map(seat => {
      seat.studentUser = userID;
      return seat.save();
    });

    await Promise.all(updatePromises);


    const reservation = new Reservation({
      reservationID: String(generateUniqueRandomNumber(1, 999999)),
      userID: userID,
      reservationSeats: seatSlots,
      reservationStatus: "Upcoming"
    });

    console.log("Saving the following details as reservation: " + reservation)

    await reservation.save();

    resp.status(200).json({ message: 'Seats updated and reservation created!' });
  } catch (error) {
    console.error('Error:', error);
    resp.status(500).json({ error: 'Something went wrong' });
  }
});


userReserveRouter.post('/reserve/:userID/:labRoom', async function(req, resp){
       console.log(req.url)
       console.log("In reserve/userID/labRoom url")
       const day = req.body?.day;
      if (day === undefined) {
        resp.status(400).send({ error: "Missing 'day' in request body" });
        return
      }

      const seats = await seatModel.find({weekDay: req.body.day, labName:req.params.labRoom})
      console.log("Finding the " + req.body.day)
      const grouped_seats = segregateSeats(seats);

      var seatNumberSet = new Set();

      for (const subgroup of grouped_seats[req.body.day]) {
        const uniqueSeatNumbers = getUniqueSeatNumbers(subgroup.seats);
        uniqueSeatNumbers.forEach(seatNumber => {seatNumberSet.add(seatNumber)});

      }

     var uniqueSeatNumbersArray = Array.from(seatNumberSet);
      console.log("Seats found: " + uniqueSeatNumbersArray);
      resp.send({
        data: uniqueSeatNumbersArray
      });

});



userReserveRouter.post('/reserve/seat', async function(req, resp){

  try {
    const { weekDay, labName, seatNumber } = req.body;
    console.log("Selected Day: " + weekDay);
    console.log("labName:", labName);
    console.log("seatNumber:", seatNumber);
    console.log("Request body has returned " + JSON.parse(JSON.stringify(req.body)) );


    // Assuming seatNumber is an array
    const seats = await seatModel.find({
      weekDay: convertToFullWeekday(weekDay),
      labName: labName,
      seatNumber: { $in: seatNumber }
    });

    const seatTimeIDs = seats.map(seat => seat.seatTimeID);



    const timeIntervals = await timeModel.find({
      timeID: { $in: seatTimeIDs }
    });

    console.log("Seat Time IDs" + seatTimeIDs);

    const seatTimeIntervals = seats.map(seat => ({
      _id: seat._id,
      seatTimeID: seat.seatTimeID,
      studentUser: seat.studentUser,
      timeInterval: getTimeInterval(timeIntervals, seat.seatTimeID)
    }));


    const morningIntervals = seatTimeIntervals.filter(seat => isMorningInterval(seat.timeInterval));
    const afternoonIntervals = seatTimeIntervals.filter(seat => isAfternoonInterval(seat.timeInterval));

    resp.send({ dataM: morningIntervals,
                dataN: afternoonIntervals
               });
    console.log("Seat time intervals of seat", seatTimeIntervals);
    console.log("Morning scheds ", morningIntervals);
    console.log("Afternoon scheds ", afternoonIntervals);


  } catch (error) {
    console.error('Error:', error);
    resp.status(500).json({ error: 'Internal Server Error' });
  }
});








module.exports = userReserveRouter
