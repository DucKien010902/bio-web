const mongoose = require('mongoose');

// Schema cho từng gói xét nghiệm
const TestPackageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Mã xét nghiệm
  name: { type: String, required: true }, // Tên dịch vụ
  schedule: String, // Lịch làm việc (Thứ 2, Thứ 3, ...)
  turnaroundTime: { type: String, required: true }, // Thời gian có kết quả
  price: { type: Number, required: true }, // Giá
  description: { type: String }, // Mô tả chi tiết
});

// Schema cho loại xét nghiệm
const TestTypeSchema = new mongoose.Schema(
  {
    typeName: { type: String, required: true }, // VD: "Xét nghiệm ADN"
    packages: [TestPackageSchema], // Danh sách các gói thuộc loại này
  },
  {
    timestamps: true,
  }
);

const TestType = mongoose.model('tests', TestTypeSchema);

module.exports = TestType;
