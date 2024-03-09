const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const labSchema = new mongoose.Schema({
  labName: {
      type: String,
      unique: true,
      required: true,
    },
  labTotalSlots: {
                  type: Number,
                  default: 0,

                  },
  labAvailSlots: {
                    type: Number,
                    default: 0,
                },
  labStatus: {
    type: String,
    enum: ['AVAILABLE', 'UNAVAILABLE', 'FULL'],
  },
}, { versionKey: false });

const LabModel = mongoose.model('Lab', labSchema);



const seatSchema = new mongoose.Schema({
  labName: {
    type: String,
    required: true,
    maxLength: 45,
    ref: 'Lab',
  },
  weekDay: {
    type: String,
    required: true,
    enum: WEEKDAYS,
  },

  seatNumber: {
    type: String,
    required: true,
  },
  seatTimeID: {
    type: Number,
    required: true,
    ref: 'Time'
  },
  studentUser: {
    type: Number,
    ref: 'User',
  },
  isAnon: {
    type: Boolean,
    default: false,
  },
});


seatSchema.pre('save', async function (next) {
  try {
    const labName = this.labName;


    const totalSeats = await this.constructor.countDocuments({ labName });


    await LabModel.findOneAndUpdate({ labName }, { $set: { labTotalSlots: totalSeats } });


    const availSeats = await this.constructor.countDocuments({ labName, studentUser: null });

    await LabModel.findOneAndUpdate({ labName }, { $set: { labAvailSlots: availSeats } });

    next();
  } catch (error) {
    next(error);
  }
});



module.exports.SeatModel = mongoose.model('Seat', seatSchema);
module.exports.LabModel = LabModel;
