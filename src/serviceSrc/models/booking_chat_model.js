const mongoose = require("mongoose");

const Booking_MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketid: String,
  time: String,
  date: String,
  to: String,
});

const Booking_Message = mongoose.model(
  "Bookings_Message",
  Booking_MessageSchema
);

module.exports = Booking_Message;
