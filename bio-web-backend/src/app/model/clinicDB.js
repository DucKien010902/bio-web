const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ID: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    workingHours: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    mainImage: {
      type: String,
      required: true,
    },
    introTitle: {
      type: String,
    },
    introBulletPoints: {
      type: [String],
      default: [],
    },
    descriptions: {
      type: [String],
      default: [],
    },
    branches: {
      type: [
        {
          city: String,
          address: String,
        },
      ],
      default: [],
    },
    mapEmbedUrl: {
      type: String,
    },
    listService: [''],
  },
  { timestamps: true }
);

module.exports = mongoose.model('clinics', ClinicSchema);
