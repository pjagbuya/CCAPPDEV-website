const SeatModel = require("../../models/lab-model").SeatModel;
const getSeatTimeRange = require("../../models/lab-model").getSeatTimeRange;
const MAX_RESERVED_SEATS_VISIBLE = 3;
// Loop through each reservation and its associated seat IDs
// Each seat IDs is segregated via key pattern "next_day_0, next_day_1"
// Loop through each reservation and its associated seat IDs
async function getSeatDate(weekday) {
  const today = new Date();
  const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdaysShort = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];


  while (today.getDay() !== weekdaysFull.indexOf(weekday)) {
    today.setDate(today.getDate() + 1);
  }

  return today;
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
async function getReservationJSON(reservations){

  const seats = {};
  for (const reservation of reservations) {
   for (const reservationSeatId of reservation.reservationSeats) {
     try {
       // Find the seat document and handle potential errors
       const seat = await SeatModel.findById(reservationSeatId);
       if (!seat) {
         console.log(`Seat not found for reservation seat ID: ${reservationSeatId}`);
         continue;
       }


       const seatDetails = {
         _id: seat._id,
         seatNumber: seat.seatNumber,
         date: formatWeekdayDate(seat.weekDay),
         timeInterval: await getSeatTimeRange(seat.seatTimeID),
         labName: seat.labName,
         isAnon: seat.isAnon
       };


       const today = new Date();
       const seatDate = await getSeatDate(seat.weekDay);

       const daysDifference = Math.floor((seatDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

       const group = `next_day_${Math.max(0, daysDifference)}`;


       if (!seats[group]) {
         seats[group] = [];
       }


       //Limits the seats the user can view
       if (seats[group].length < MAX_RESERVED_SEATS_VISIBLE) {
         seats[group].push(seatDetails);
       }

     } catch (error) {
       console.error(`Error fetching seat details for seat ID: ${reservationSeatId}`, error);
     }
   }
 }

 return seats
}

module.exports.getReservationJSON = getReservationJSON;
