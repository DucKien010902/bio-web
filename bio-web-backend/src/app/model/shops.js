const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shopID: {
    type: String,
    required: true,
    unique: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  coverUrl: String,
  address: String,
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
  },

  productsCount: {
    type: Number,
    default: 0,
  },

  ratingCount: {
    type: Number,
    default: 0,
  },

  replyRate: {
    type: Number, // phần trăm, ví dụ: 100 (%)
    default: 0,
  },
  replyTime: {
    type: String, // ví dụ: 'Trong vài giờ', 'Trong vài phút'
    default: 'Không rõ',
  },

  joinedAt: {
    type: Date,
    default: Date.now, // ngày tham gia shop
  },

  followerCount: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
    default: '',
  },

  verified: {
    type: Boolean,
    default: false, // shop đã xác minh chưa
  },
  productCategories: [
    {
      categoryName: { type: String, required: true },
      productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
    },
  ],
});

module.exports = mongoose.model('shops', shopSchema);
