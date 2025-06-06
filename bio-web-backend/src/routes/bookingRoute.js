const express = require('express');
const route = express.Router();
const Booking = require('../app/controllers/FirstBookingController');
route.post('/addfirst', Booking.addFirst);
route.put('/:id/confirm', Booking.confirmBooking);
route.put('/:id', Booking.updateBookingFields); // 👈 thêm dòng này
route.get('/fetchall', Booking.fetchall);
route.get('/fetchbyclinic', Booking.fetchByClinic);
route.get('/fetchbyphone', Booking.fetchByPhone);
module.exports = route;
