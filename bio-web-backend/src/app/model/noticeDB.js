const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
  {
    postid: { type: String, required: true, unique: true }, // mã bài viết
    Type: { type: String }, // loại thông báo
    Time: { type: Date, default: Date.now }, // thời gian tạo / đăng
    File: { type: String }, // đường dẫn file đính kèm (nếu có)
    Title: { type: String, required: true }, // tiêu đề
    Content: { type: String }, // nội dung chi tiết
    Voice: { type: String }, // đường dẫn file audio (nếu có)
    isViewed: { type: Boolean },
  },
  {
    timestamps: true, // tự động thêm createdAt & updatedAt
  }
);

const Notice = mongoose.model('Notice', NoticeSchema, 'notice');

module.exports = Notice;
