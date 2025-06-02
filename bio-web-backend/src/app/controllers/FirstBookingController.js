const mongoose = require('mongoose');
const Booking = require('../model/bookingDB');

class ClinicController {
  async addFirst(req, res) {
    try {
      const booking = new Booking(req.body);
      console.log(req.body);
      await booking.save();
      return res.status(200).json({ message: 'SuccessAdd' });
    } catch (error) {
      return res.status(500).json({ message: 'FailAdd' });
    }
  }
  async fetchall(req, res) {
    try {
      const AllBooking = await Booking.find({});
      return res.status(200).json(AllBooking);
    } catch (error) {
      return res.status(500).json({ message: 'FailFetch' });
    }
  }
  async confirmBooking(req, res) {
    try {
      const { id } = req.params; // Lấy id từ params URL
      const { confirmed } = req.body; // Lấy trạng thái confirmed từ body

      // Cập nhật trường confirmed cho booking có _id = id
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { confirmed: confirmed },
        { new: true } // Trả về document đã được cập nhật
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      return res.status(200).json({
        message: 'Booking confirmed updated successfully',
        booking: updatedBooking,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'FailUpdate' });
    }
  }
}

module.exports = new ClinicController();
