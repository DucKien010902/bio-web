// controllers/OrdersController.js
const mongoose = require('mongoose');
const Voucher = require('../model/voucherDB');
const UserVoucher = require('../model/voucherOfUser');
function generateVoucherID(existingIDs) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id;
  do {
    id = '';
    for (let i = 0; i < 9; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (existingIDs.includes(id));
  return id;
}

class VoucherController {
  // Tạo đơn hàng mới
  async createVoucher(req, res) {
    // console.log(req.body);
    try {
      const existing = await Voucher.find({}, 'voucherID');
      const existingIDs = existing.map((v) => v.voucherID);
      const voucherID = generateVoucherID(existingIDs);

      const newVoucher = new Voucher({
        ...req.body,
        voucherID,
      });

      await newVoucher.save();
      return res.json({ message: 'Đã thêm voucher', voucherID });
    } catch (err) {
      return res
        .status(400)
        .json({ message: 'Thêm thất bại', error: err.message });
    }
  }
  async saveUserVoucher(req, res) {
    try {
      const { voucherID, phoneNumber } = req.body;

      // Kiểm tra xem user đã lấy voucher này chưa
      const existingUserVoucher = await UserVoucher.findOne({
        voucherID,
        phoneNumber,
      });
      if (existingUserVoucher) {
        return res.status(400).json({
          message: 'Bạn đã nhận voucher này rồi',
        });
      }

      // Giảm quantity atomically
      const updatedVoucher = await Voucher.findOneAndUpdate(
        { voucherID, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } },
        { new: true }
      );

      if (!updatedVoucher) {
        return res.status(400).json({ message: 'Đã hết voucher loại này' });
      }

      // Lưu thông tin người dùng nhận voucher
      const newUserVoucher = new UserVoucher(req.body);
      await newUserVoucher.save();

      return res.status(200).json({
        message: 'Lưu thành công',
        remainingQuantity: updatedVoucher.quantity,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Lỗi server', error: error.message });
    }
  }

  async getVoucherGen(req, res) {
    try {
      const vouchers = await Voucher.find({});
      return res.json(vouchers);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async getVoucherByShopID(req, res) {
    try {
      const { shopID } = req.query;
      const vouchers = await Voucher.find({ shopID });
      return res.json(vouchers);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async getVoucherByUser(req, res) {
    try {
      const { phoneNumber } = req.query;
      const vouchers = await UserVoucher.find({ phoneNumber });
      return res.json(vouchers);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async getVoucherByUserAndID(req, res) {
    try {
      const { shopID, phoneNumber } = req.query;
      const vouchers = await UserVoucher.find({ shopID, phoneNumber });
      return res.json(vouchers);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async deleteVoucherByID(req, res) {
    console.log('here');
    try {
      console.log('huu');
      const { voucherID } = req.body;
      console.log('--' + voucherID);
      const deleted = await Voucher.findOneAndDelete({
        voucherID,
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Voucher không tồn tại' });
      }

      return res.json({ message: 'Đã xoá voucher' });
    } catch (err) {
      return res.status(500).json({ message: 'Xoá bại thất' });
    }
  }
  async deleteVoucherByUser(req, res) {
    try {
      const { voucherID, phoneNumber } = req.body;
      console.log(voucherID);
      const deleted = await UserVoucher.findOneAndDelete({
        voucherID,
        phoneNumber,
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Voucher không tồn tại' });
      }

      return res.json({ message: 'Đã sử dụng voucher' });
    } catch (err) {
      return res.status(500).json({ message: 'Xoá voucher thất bại' });
    }
  }
}

module.exports = new VoucherController();
