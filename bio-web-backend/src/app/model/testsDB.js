const mongoose = require('mongoose');

const TestPackageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  schedule: String,
  turnaroundTime: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

const TestTypeSchema = new mongoose.Schema(
  {
    typeName: { type: String, required: true },
    packages: [TestPackageSchema],
  },
  {
    timestamps: true,
  }
);

const TestType = mongoose.model('tests', TestTypeSchema);

module.exports = TestType;
