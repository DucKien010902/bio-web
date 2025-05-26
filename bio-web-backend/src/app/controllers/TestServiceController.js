const mongoose = require('mongoose');
const Test = require('../model/testsDB');

class TestTypeController {
  async fetchAll(req, res) {
    try {
      const response = await Test.find({});
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
}

module.exports = new TestTypeController();
