
const mongoose = require("mongoose")


const timeSchema = new mongoose.Schema({
  timeID: {
    type: Number,
    unique: true,
    required: true,
  },
  timeIN: {
    type: String,
    required: true,
  },
  timeOUT: {
    type: String,
    required: true,
  },

});


module.exports = mongoose.model('Time', timeSchema);
