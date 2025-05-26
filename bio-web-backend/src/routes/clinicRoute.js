const express = require('express');
const route = express.Router();
const Clinic = require('../app/controllers/ClinicController');
route.get('/fetchall', Clinic.fetchAll);
module.exports = route;
