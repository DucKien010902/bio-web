const express = require('express');
const route = express.Router();
const Users = require('../app/controllers/UsersController');
route.post('/createaccount', Users.createAccount);
route.post('/checkaccount', Users.checkAccount);
module.exports = route;
