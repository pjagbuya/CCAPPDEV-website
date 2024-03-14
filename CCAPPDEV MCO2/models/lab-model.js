const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const Time = require('./time-model');
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
const SeatModel = mongoose.model('Seat', seatSchema);
function segregateSeats(seats) {
  try {
    // Create an object to store seats grouped by weekday
    const seatsByWeekday = {};

    // Group seats by weekday
    seats.forEach((seat) => {
      const weekday = seat.weekDay;
      if (!seatsByWeekday[weekday]) {
        seatsByWeekday[weekday] = [];
      }

      // console.log("Splitting by "+ weekday)
      seatsByWeekday[weekday].push(seat);
    });


    const subgroupsByWeekday = {};
    Object.keys(seatsByWeekday).forEach((weekday) => {
      const seatsForWeekday = seatsByWeekday[weekday];
      const subgroups = splitSeatsIntoSubgroups(seatsForWeekday);
      subgroupsByWeekday[weekday] = subgroups;
    });

    return subgroupsByWeekday;
  } catch (error) {
    console.error('Error splitting seats by weekday:', error);
    throw error;
  }
}
function splitSeatsIntoSubgroups(seats) {
  try {

    const numberOfSubgroups = Math.ceil(seats.length / 4);

    const subgroups = Array.from({ length: numberOfSubgroups }, (_, index) => ({
      subgroupNumber: index + 1,
      seats: seats.slice(index * 4, (index + 1) * 4),
    }))


    return subgroups;
  } catch (error) {
    console.error('Error splitting seats into subgroups:', error);
    throw error;
  }
}

function getUniqueSeatNumbers(seats) {
  try {
    const uniqueSeatNumbers = [...new Set(seats.map((seat) => seat.seatNumber))];

    return uniqueSeatNumbers;
  } catch (error) {
    console.error('Error getting unique seat numbers:', error);
    throw error;
  }
}
async function getSeatTimeRange(seatTimeID) {
  try {
    // Find the corresponding Time document based on seatTimeID
    const time = await Time.findOne({ timeID: seatTimeID }).exec();

    if (!time) {
      throw new Error(`Time with timeID ${seatTimeID} not found`);
    }


    const { timeIN, timeOUT } = time;


    const timeInterval = `${timeIN} - ${timeOUT}`;

    return timeInterval;
  } catch (error) {
    console.error('Error getting seat time range:', error);
    throw error;
  }
}

seatSchema.pre('save', async function (next) {
  try {
    const labName = this.labName;


    const totalSeats = await this.constructor.countDocuments({ labName });
    const availSeats = await this.constructor.countDocuments({ labName, studentUser: null });
    console.log('Updating LabModel for lab:', labName);
    console.log('Total Seats:', totalSeats);
    console.log('Available Seats:', availSeats);
    await LabModel.findOneAndUpdate({ labName }, { $set: { labTotalSlots: totalSeats, labAvailSlots: availSeats } });

    next();
  } catch (error) {
    next(error);
  }
});


async function updateLabInformation() {
  try {
    const labs = await LabModel.find({});
    for (const lab of labs) {
      const labName = lab.labName;

      const totalSeats = await SeatModel.countDocuments({ labName });
      const availSeats = await SeatModel.countDocuments({ labName, studentUser: null });

      await LabModel.findOneAndUpdate({ labName }, { $set: { labTotalSlots: totalSeats, labAvailSlots: availSeats } });
    }

    console.log('Lab information updated successfully!');
  } catch (error) {
    console.error('Error updating lab information:', error);
  }
}



module.exports.getSeatTimeRange = getSeatTimeRange;
module.exports.segregateSeats = segregateSeats;
module.exports.getUniqueSeatNumbers = getUniqueSeatNumbers;
module.exports.SeatModel = SeatModel;
module.exports.LabModel = LabModel;
module.exports.updateLabInformation = updateLabInformation;
