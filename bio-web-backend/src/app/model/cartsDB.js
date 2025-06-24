const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carts = new Schema({
  phoneNumber: String,
  cart: [
    {
      Id: String,
      counts: Number,
      pdImage: String,
      pdName: String,
      pdDes: String,
      pdPrice: Number,
      pdVouncher: Number,
      pdCountSale: Number,
      pdShopID: String,
      pdShopName: String,
      pdType: String,
      pdStar: Number,
      pdDayDelivery: String,
    },
  ],
});
module.exports = mongoose.model('carts', carts);
