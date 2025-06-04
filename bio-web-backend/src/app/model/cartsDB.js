const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carts = new Schema({
  phoneNumber: String,
  cart: [
    {
      Id: String,
      counts: Number,
    },
  ],
});
module.exports = mongoose.model('carts', carts);
