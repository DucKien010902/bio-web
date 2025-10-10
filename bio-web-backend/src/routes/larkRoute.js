const express = require('express');
const router = express.Router();
const LarkController = require('../app/controllers/larkController');

router.get('/callback', LarkController.oauthCallback); // callback OAuth
router.get('/departments', LarkController.getDepartments); // lấy phòng ban
router.get('/all-departments', LarkController.getAllDepartments); // lấy phòng ban
router.get('/users', LarkController.getUsersByDepartment); // lấy user theo phòng ban

module.exports = router;
