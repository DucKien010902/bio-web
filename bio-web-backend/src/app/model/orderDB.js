// models/Booking.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderID: String,
    totalPrice: Number,
    totalCount: Number,
    shopID: String,
    shopName: String,
    productName: String,
    productID: String,
    productImage: String,
    productCategory: String,
    productPrice: Number,
    name: String,
    phone: String,
    location: String,
    status: {
      type: String,
      enum: [
        'Đã đặt đơn',
        'Đang chuẩn bị hàng',
        'Đã giao cho đơn vị vận chuyển',
        'Đang vận chuyển',
        'Đã giao hàng',
        'Đã hủy',
      ],
      default: 'Đã đặt đơn',
    },
    collectAt: String,
    resultAt: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('orders', OrderSchema);
