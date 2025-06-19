const mongoose = require('mongoose');
const Booking = require('../model/bookingDB');

class ClinicController {
  async addFirst(req, res) {
    try {
      // Hàm tạo mã 6 ký tự chữ hoa và số
      const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      // Tạo mã duy nhất
      let uniqueCode;
      let isUnique = false;

      while (!isUnique) {
        const tempCode = generateCode();
        const existing = await Booking.findOne({ bookID: tempCode });
        if (!existing) {
          uniqueCode = tempCode;
          isUnique = true;
        }
      }

      // Gán mã vào body và lưu
      const booking = new Booking({ ...req.body, bookID: uniqueCode });
      await booking.save();

      return res
        .status(200)
        .json({ message: 'SuccessAdd', bookID: uniqueCode });
    } catch (error) {
      console.error(error);
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
  async fetchByPhone(req, res) {
    const { phone } = req.query;
    try {
      const Bookings = await Booking.find({ phone });
      return res.status(200).json(Bookings);
    } catch (error) {
      return res.status(500).json({ message: 'FailFetch' });
    }
  }
  async fetchByClinic(req, res) {
    const { clinicID } = req.query;
    console.log(clinicID);
    try {
      const Bookings = await Booking.find({ facilityID: clinicID });
      return res.status(200).json(Bookings);
    } catch (error) {
      return res.status(500).json({ message: 'FailFetch' });
    }
  }
  async confirmBooking(req, res) {
    try {
      const { id } = req.params;
      const { status, sampleCollectorID, sampleCollectorName, resultLink } =
        req.body;

      const updateFields = { status };

      // Nếu có thông tin nhân viên thu mẫu thì thêm vào bản cập nhật
      if (sampleCollectorID) {
        updateFields.sampleCollectorID = sampleCollectorID;
      }

      if (sampleCollectorName) {
        updateFields.sampleCollectorName = sampleCollectorName;
      }
      if (resultLink) {
        updateFields.resultLink = resultLink;
      }

      const updatedBooking = await Booking.findOneAndUpdate(
        { bookID: id },
        updateFields,
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt' });
      }

      return res.status(200).json({
        message: 'Cập nhật trạng thái thành công',
        booking: updatedBooking,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi cập nhật trạng thái' });
    }
  }

  async updateBookingFields(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Chỉ cho phép cập nhật các trường cụ thể
      const allowedFields = ['location', 'samplingMethod'];
      const sanitizedUpdates = {};

      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          sanitizedUpdates[field] = updates[field];
        }
      });

      if (Object.keys(sanitizedUpdates).length === 0) {
        return res
          .status(400)
          .json({ message: 'Không có trường hợp lệ để cập nhật' });
      }

      const updated = await Booking.findOneAndUpdate(
        { bookID: id },
        sanitizedUpdates,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt' });
      }

      return res
        .status(200)
        .json({ message: 'Cập nhật thành công', data: updated });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi cập nhật đơn đặt' });
    }
  }
}

module.exports = new ClinicController();
