const express = require('express');
const route = express.Router();
const Order = require('../app/controllers/OrdersController');
const authMiddleware = require('../middlewares/authMiddleware');
route.get('/getOrderHistorybyPhone', authMiddleware, Order.getOrdersByPhone);
route.post('/addtoOrderHistory', authMiddleware, Order.createOrder);
module.exports = route;
