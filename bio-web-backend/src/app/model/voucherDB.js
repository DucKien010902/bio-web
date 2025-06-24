// models/Booking.js
const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema(
  {
    shopID: {
      type: String,
      required: true,
    },
    voucherID: {
      type: String,
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minOrder: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('vouchers', VoucherSchema);
