
const Reservation = require("../../models/reserve-model");
async function generateRandomNumericId(reservations) {
  const length = 8;
  const digits = '0123456789';
  let existingReservation;
  let result = '';
  do {

    for (let i = 0; i < length; i++) {
      result += digits[Math.floor(Math.random() * digits.length)];
    }

    existingReservation = await Reservation.findOne({ reservationID: result });
  } while (existingReservation !== null);

  return result;
}



module.exports.generateRandomNumericId = generateRandomNumericId;
