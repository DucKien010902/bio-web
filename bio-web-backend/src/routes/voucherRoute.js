const express = require('express');
const route = express.Router();
const Vouncher = require('../app/controllers/VoucherController');
route.post('/deleteVoucher', Vouncher.deleteVoucherByID);
route.post('/addVoucher', Vouncher.createVoucher);
route.post('/saveUserVoucher', Vouncher.saveUserVoucher);
route.get('/getVoucherByShopID', Vouncher.getVoucherByShopID);
route.get('/getVoucherByUser', Vouncher.getVoucherByUser);
module.exports = route;
