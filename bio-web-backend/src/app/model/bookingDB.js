// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookID: String,
    date: String,
    time: String,
    facility: String,
    facilityID: String,
    serviceCode: String,
    serviceName: String,
    name: String,
    phone: String,
    dob: String,
    location: String,
    status: {
      type: String,
      enum: [
        'Đã đặt đơn',
        'Đã xác nhận',
        'Đã thu mẫu',
        'Đang xét nghiệm',
        'Đã có kết quả',
      ],
      default: 'Đã đặt đơn',
    },
    samplingMethod: {
      type: String,
      enum: ['Tại nhà', 'Tại phòng khám'],
      default: 'Tại phòng khám',
    },
    sampleCollectorID: String,
    sampleCollectorName: String,
    collectAt: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('booking', bookingSchema);
