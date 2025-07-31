// models/Voucher.js
const mongoose = require('mongoose');
const UserVoucher = require('./voucherOfUser'); // đường dẫn đúng theo dự án bạn

const VoucherSchema = new mongoose.Schema(
  {
    shopID: { type: String, required: true },
    voucherID: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    discount: { type: Number, required: true },
    minOrder: { type: Number, required: true },
    maxDiscount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    expiry: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// 👉 Middleware: khi xóa voucher tổng → xóa luôn các voucher user tương ứng
VoucherSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc && doc.voucherID) {
    await UserVoucher.deleteMany({ voucherID: doc.voucherID });
  }
  next();
});

module.exports = mongoose.model('vouchers', VoucherSchema);
