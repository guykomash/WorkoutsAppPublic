const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router
  .route('/')
  .get(verifyRoles(ROLES_LIST.User), uploadController.getSignedUrl);

module.exports = router;
