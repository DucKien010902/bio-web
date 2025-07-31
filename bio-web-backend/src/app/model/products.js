const mongoose = require('mongoose');
const Cart = require('./cartsDB'); // đường dẫn đúng tới file carts.js

const Schema = mongoose.Schema;

const products = new Schema({
  Id: String,
  pdImage: String,
  pdName: String,
  pdDes: String,
  pdPrice: Number,
  pdVouncher: Number,
  pdCountSale: Number,
  pdStar: Number,
  pdDayDelivery: String,
  pdTypes: [''],
  pdClassify: String,
  pdCategory: String,
  pdShopID: String,
  pdShopName: String,
  pdDetailData: [{}],
  pdMoreDescriptions: String,
});

// 👉 Tự động xoá khỏi cart khi xoá sản phẩm tổng
products.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc && doc.Id) {
    // Xóa sản phẩm có Id trùng trong mọi cart
    await Cart.updateMany({}, { $pull: { cart: { Id: doc.Id } } });
  }
  next();
});

module.exports = mongoose.model('products', products);
