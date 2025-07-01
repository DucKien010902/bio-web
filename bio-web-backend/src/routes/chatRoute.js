const express = require('express');
const route = express.Router();
const Chat = require('../app/controllers/chatController');
route.get('/getAllMessageByUser', Chat.getMessageByUser);
route.get('/getAllMessageByShop', Chat.getMessageByShop);
route.post('/sendmessage', Chat.sendMessage);
module.exports = route;
