const express = require('express');
const route = express.Router();
const Order = require('../app/controllers/OrdersController');
route.get('/getOrderHistorybyPhone', Order.getOrdersByPhone);
route.post('/addtoOrderHistory', Order.createOrder);
module.exports = route;
