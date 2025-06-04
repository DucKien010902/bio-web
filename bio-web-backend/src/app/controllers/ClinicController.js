const mongoose = require('mongoose');
const Clinic = require('../model/clinicDB');

class ClinicController {
  async fetchAll(req, res) {
    try {
      const response = await Clinic.find({});
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async updateClinic(req, res) {
    try {
      const updateData = req.body;

      if (!updateData.ID) {
        return res.status(400).json({ message: 'Thiếu ID để cập nhật' });
      }

      // Cập nhật clinic dựa theo ID
      const updatedClinic = await Clinic.findOneAndUpdate(
        { ID: updateData.ID },
        { $set: updateData },
        { new: true } // trả về dữ liệu sau cập nhật
      );

      if (!updatedClinic) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy clinic với ID này' });
      }

      return res.status(200).json({
        message: 'Cập nhật thành công',
        data: updatedClinic,
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật clinic:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new ClinicController();
