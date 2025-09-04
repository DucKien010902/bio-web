const express = require('express');
const route = express.Router();
const Notice = require('../app/controllers/noticeController');
route.get('/getall', Notice.getAllNotice);
route.post('/mark-viewed', Notice.markAsViewed);
module.exports = route;
