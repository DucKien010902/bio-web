// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    date: String,
    time: String,
    facility: String,
    serviceCode: String,
    name: String,
    phone: String,
    dob: String,
    location: String,
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('booking', bookingSchema);
