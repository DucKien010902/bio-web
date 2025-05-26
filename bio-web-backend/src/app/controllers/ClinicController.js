const mongoose = require('mongoose');
const Clinic = require('../model/clinicDB');

class ClinicController {
  async fetchAll(req, res) {
    try {
      const response = await Clinic.find({});
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
}

module.exports = new ClinicController();
