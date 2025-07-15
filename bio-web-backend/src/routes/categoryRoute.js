const express = require('express');
const route = express.Router();
const Category = require('../app/controllers/categoryController');
route.get('/getall', Category.getAllCategories);
route.post('/addcategory', Category.addCategory);
route.post('/deletecategory', Category.deleteCategory);
route.post('/addclassify', Category.addClassify);
route.post('/deleteclassify', Category.removeClassify);
module.exports = route;
