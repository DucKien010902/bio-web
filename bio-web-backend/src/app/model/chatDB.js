const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chatSchema = new mongoose.Schema({
  chatID: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    index: true,
  },
  members: {
    shop: {
      shopID: { type: String, required: true },
      shopName: String,
      avatarUrl: String,
    },
    customer: {
      userID: { type: String, required: true },
      userName: String,
      avatarUrl: String,
    },
  },
  messages: [
    {
      id: { type: String, default: uuidv4 },
      fromShop: { type: Boolean, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('chats', chatSchema);
