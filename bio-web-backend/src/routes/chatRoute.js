const express = require('express');
const route = express.Router();
const Chat = require('../app/controllers/chatController');
route.get('/getAllMessageByUser', Chat.getMessage);
route.post('/sendmessage', Chat.sendMessage);
module.exports = route;
