const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  classifies: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('category', CategorySchema, 'category');
