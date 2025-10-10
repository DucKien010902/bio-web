const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    mainImage: { type: String },
    establish: { type: String },
    mainTitle: { type: String },
    question: { type: String },
    openContent: { type: String },
    firstTitle: { type: String },
    firstContent: { type: String },
    firstImage: { type: String },
    firstImageNote: { type: String }, //label của ảnh
    secondTitle: { type: String },
    secondContent: { type: String },
    secondImage: { type: String },
    secondImageNote: { type: String }, //label của ảnh
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model('newDB', NewsSchema, 'newDB');

module.exports = News;
