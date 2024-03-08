const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');



const labSchema = new mongoose.Schema({
  labName: {
      type: String,
      unique: true,
      required: true,
    },
  labTotalSlots: Number,
  labAvailSlots: Number,
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
  seatNumber: {
    type: String,
    required: true,
  },
  seatTimeIN: {
    type: String,
    required: true,
  },
  seatTimeOUT: {
    type: String,
    required: true,
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

const daySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
  },
});

const MondayModel = mongoose.model('Monday', daySchema);
const TuesdayModel = mongoose.model('Tuesday', daySchema);
const WednesdayModel = mongoose.model('Wednesday', daySchema);
const ThursdayModel = mongoose.model('Thursday', daySchema);
const FridayModel = mongoose.model('Friday', daySchema);
const SaturdayModel = mongoose.model('Saturday', daySchema);
const SundayModel = mongoose.model('Sunday', daySchema);


module.exports.MondayModel = MondayModel;
module.exports.TuesdayModel = TuesdayModel;
module.exports.WednesdayModel = WednesdayModel;
module.exports.ThursdayModel = ThursdayModel;
module.exports.FridayModel = FridayModel;
module.exports.SaturdayModel = SaturdayModel;
module.exports.SundayModel = SundayModel;
module.exports.LabModel = LabModel;
