const express = require('express');
const route = express.Router();
const Shop = require('../app/controllers/ShopController');
route.get('/fetchShopInfoByPhoneNumber', Shop.fetchShopInfoByPhoneNumber);
route.get('/fetchShopInfoByID', Shop.fetchShopInfoByID);
route.put('/update/:id', Shop.updateShop);
route.post('/updateOnlineStatus', Shop.updateOnlineStatus);
module.exports = route;
