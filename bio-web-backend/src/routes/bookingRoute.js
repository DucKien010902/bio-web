const express = require('express');
const route = express.Router();
const Booking = require('../app/controllers/FirstBookingController');
route.post('/addfirst', Booking.addFirst);
route.put('/:id/confirm', Booking.confirmBooking);
route.get('/fetchall', Booking.fetchall);
module.exports = route;
