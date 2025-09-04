const express = require('express');
const route = express.Router();
const Notice = require('../app/controllers/noticeController');
route.get('/getall', Notice.getAllNotice);
module.exports = route;
