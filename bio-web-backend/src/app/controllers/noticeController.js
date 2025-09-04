// controllers/ApproveController.js
const mongoose = require('mongoose');
const Notice = require('../model/noticeDB');

class NoticeController {
  // Lấy tất cả đề xuất hiện có
  async getAllNotice(req, res) {
    try {
      const data = await Notice.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new NoticeController();
