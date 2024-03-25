

// Loop through each reservation and its associated seat IDs
// Each seat IDs is segregated via key pattern "next_day_0, next_day_1"
// Loop through each reservation and its associated seat IDs

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
         labName: seat.labName, // Include if needed
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
