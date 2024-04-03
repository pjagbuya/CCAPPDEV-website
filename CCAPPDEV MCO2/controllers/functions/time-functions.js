const Time = require("../../models/time-model");
const reservationModel = require("../../models/reserve-model");
var allUniqueTimes;
async function initializeUniqueTimes() {
  const uniqueTimeIds = await Time.distinct('timeID', { timeID: { $gte: 1, $lte: 20 } });

  const timeData = await Time.find({ timeID: { $in: uniqueTimeIds } })

  allUniqueTimes = timeData.map(({ timeID, timeIN, timeOUT }) => ({
    timeId: timeID,
    timeInterval: `${timeIN} - ${timeOUT}`
  }));

  return allUniqueTimes;
}
 function formatWeekdayDate(weekday) {
   const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   const weekdaysShort = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

   const today = new Date();
   let currentWeekdayIndex = today.getDay();


   if (!weekdaysFull.includes(weekday)) {
     throw new Error('Invalid weekday provided');
   }

   const targetWeekdayIndex = weekdaysFull.indexOf(weekday);

   let daysToAdd = (targetWeekdayIndex - currentWeekdayIndex + 7) % 7;
   if (daysToAdd === 0 && currentWeekdayIndex === targetWeekdayIndex) {
     daysToAdd = 0;
   }

   const targetDate = new Date();
   targetDate.setDate(today.getDate() + daysToAdd);


   const shortWeekday = weekdaysShort[targetDate.getDay()];

   const formattedDate = `${shortWeekday}, ${targetDate.toDateString().split(' ')[1]} ${targetDate.getDate()}`;

   return formattedDate;
 }


function convertTimeIdToInterval(timeId) {
   const matchingTime = allUniqueTimes.find(timeData => timeData.timeId === timeId);

   if (matchingTime) {
     return matchingTime.timeInterval;
   } else {
     return 'Time Interval Not Found';
   }
 }


 async function keyLabNamesToSeatIds(reservationIdValue, reservationIdField = 'reservationID') {
   try {
     const query = {};
     query[reservationIdField] = reservationIdValue;

     const reservation = await reservationModel.findOne(query)
       .populate('reservationSeats');

     const result = [];

     const seatsByLabName = {};
     const sortedSeats = reservation.reservationSeats.sort((seat1, seat2) => seat1.seatTimeID - seat2.seatTimeID);

     const labNamesToSeats = sortedSeats.reduce((acc, seat) => {
       const labName = seat.labName;

       if (!acc[labName]) {
         acc[labName] = {
           labName,
           firstSeat: null,
           otherSeats: [],
           totalSeats: 0
         };
       }

       const seatData = {
         seatId: seat._id,
         seatNumber: seat.seatNumber,
         weekDay: formatWeekdayDate(seat.weekDay),
         timeInterval: convertTimeIdToInterval(seat.seatTimeID)
       }

       if (!acc[labName].firstSeat) {
         acc[labName].firstSeat = seatData;
       } else {
         acc[labName].otherSeats.push(seatData);
       }

       acc[labName].totalSeats++;
       return acc;
     }, {});

     return Object.values(labNamesToSeats);
   } catch(error) {
     console.error("Error grouping seats:", error);
     throw error;
   }
 }


 async function getSeatDate(weekday) {
   const today = new Date();


   while (today.getDay() !== weekdaysFull.indexOf(weekday)) {
     today.setDate(today.getDate() + 1);
   }

   return today;
 }
 function convertToFullWeekday(shorthand) {
  const weekdaysMap = {
    'Sun': 'Sunday',
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
  };

  return weekdaysMap[shorthand] || shorthand;
}

function getTimeInterval(timeIntervals, seatTimeID) {
  const time = timeIntervals.find(time => time.timeID === seatTimeID);
  return time ? `${time.timeIN} - ${time.timeOUT}` : '';
}
function isMorning(timeInterval) {
  const twelveThirty = '12:30';

  return timeInterval.timeOUT < twelveThirty;
}
async function getOccupyingUserID(timeID, day, labName, seatNumber) {
  try {
    const occupiedSeat = await seatModel.findOne({
      seatNumber,
      weekDay: day,
      labName,
      seatTimeID: timeID,
      studentUser: { $exists: true }
    });

    return occupiedSeat ? occupiedSeat.studentUser : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
function isUserNull(user) {
  return user === null;
}


function isMorningInterval(timeInterval) {
  const startTime = timeInterval.split(' - ')[0];
  return startTime < '12:00';
}

function isAfternoonInterval(timeInterval) {
  const startTime = timeInterval.split(' - ')[0];
  return startTime >= '12:00' && startTime < '17:00';
}

module.exports.keyLabNamesToSeatIds = keyLabNamesToSeatIds
module.exports.convertTimeIdToInterval = convertTimeIdToInterval
module.exports.formatWeekdayDate = formatWeekdayDate
module.exports.initializeUniqueTimes = initializeUniqueTimes
module.exports.getSeatDate = getSeatDate
module.exports.convertToFullWeekday = convertToFullWeekday;
module.exports.getTimeInterval = getTimeInterval;
module.exports.isMorning = isMorning;
module.exports.getOccupyingUserID = getOccupyingUserID;
module.exports.isUserNull = isUserNull;
module.exports.isMorningInterval = isMorningInterval;
module.exports.isAfternoonInterval = isAfternoonInterval;
