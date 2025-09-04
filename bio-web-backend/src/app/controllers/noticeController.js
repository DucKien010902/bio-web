// controllers/ApproveController.js
const Notice = require('../model/noticeDB');

class NoticeController {
  // Lấy tất cả thông báo
  async getAllNotice(req, res) {
    try {
      const data = await Notice.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Update isViewed = true theo postid
  async markAsViewed(req, res) {
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
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new NoticeController();
