// models/approveDB.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApproveSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  classify: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('approve', ApproveSchema, 'approve');
