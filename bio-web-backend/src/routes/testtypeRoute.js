const express = require('express');
const route = express.Router();
const TestType = require('../app/controllers/TestServiceController');
route.get('/fetchall', TestType.fetchAll);
route.post('/addservice/:typeName/packages', TestType.addPackage);
route.put('/updateservice/:typeName/:code', TestType.updatePackage);
route.delete('/deleteservice', TestType.deletePackage);
module.exports = route;
