// controllers/ApproveController.js
const Notice = require('../model/noticeDB');
const mongoose = require('mongoose');

class NoticeController {
  async getAllNotice(req, res) {
    try {
      const { phoneNumber } = req.query;

      let filter = {};
      if (phoneNumber) {
        // Có phoneNumber -> lấy notice chung + notice riêng cho số đó
        filter = {
          $or: [
            { PhoneNumber: phoneNumber }, // notice cho user cụ thể
            { PhoneNumber: { $in: [null, undefined, ''] } }, // notice chung
          ],
        };
      } else {
        // Không có phoneNumber -> chỉ lấy notice chung
        filter = { PhoneNumber: { $in: [null, undefined, ''] } };
      }

      const data = await Notice.find(filter);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  async addFirst(req, res) {
    try {
      // Sau khi lưu booking -> tạo thông báo
      const notice = new Notice({
        postid: new mongoose.Types.ObjectId().toString(), // tự tạo ID duy nhất
        Type: 'Info',
        Title: 'Bạn đã đặt lịch thành công',
        Content: `${req.body.facility} - ${req.body.serviceName}\n${req.body.time} - ${req.body.date}`,
        PhoneNumber: req.body.phone,
        Classify: 'Đặt lịch',
        isViewed: false,
      });
      await notice.save();

      return res.status(200).json({ message: 'Đặt lịch thành công' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Không thể đặt lịch' });
    }
  }

  // Update isViewed = true theo postid
  async markAsViewed(req, res) {
    console.log(req.body);
    try {
      const { postid } = req.body; // nhận từ client
      const updated = await Notice.findOneAndUpdate(
        { postid }, // tìm theo postid
        { isViewed: true }, // cập nhật
        { new: true } // trả về bản ghi sau khi update
      );

      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo' });
      }
      return res.status(200).json(updated);
    } catch (error) {
      console.log('error');
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new NoticeController();
