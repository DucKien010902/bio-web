// controllers/OrdersController.js
const mongoose = require('mongoose');
const Order = require('../model/orderDB');

function generateOrderID(existingIDs) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id;

  do {
    id = '';
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      id += chars[randomIndex];
    }
  } while (existingIDs.includes(id));

  return id;
}

class OrdersController {
  // Tạo đơn hàng mới
  async createOrder(req, res) {
    try {
      const existingOrders = await Order.find({}, 'orderID');
      const existingIDs = existingOrders.map((o) => o.orderID);
      const orderID = generateOrderID(existingIDs);

      const newOrder = new Order({
        orderID,
        ...req.body,
      });

      await newOrder.save();
      return res.status(201).json({ message: 'Đơn hàng đã được tạo', orderID });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
    }
  }

  // Lấy danh sách đơn hàng theo số điện thoại
  async getOrdersByPhone(req, res) {
    try {
      const { phone } = req.query;
      if (!phone)
        return res.status(400).json({ message: 'Thiếu số điện thoại' });

      const orders = await Order.find({ phone }).sort({ createdAt: -1 });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
    }
  }
}

module.exports = new OrdersController();
