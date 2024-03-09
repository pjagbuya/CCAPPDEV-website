const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');


const reservationSchema = new mongoose.Schema({
  reservationID: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  labID: {
    type: Number,
    required: true,
    ref: 'Lab',
  },
  userID: {
    type: Number,
    required: true,
    ref: 'User',
  },

  reservationSeats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
  }],
  ReservationStatus: {
    type: String,
    enum: ['Finished', 'Ongoing', 'Upcoming'],
    default: 'Upcoming',
  },
});
