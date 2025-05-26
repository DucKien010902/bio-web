const express = require('express');
const route = express.Router();
const TestType = require('../app/controllers/TestServiceController');
route.get('/fetchall', TestType.fetchAll);
module.exports = route;
