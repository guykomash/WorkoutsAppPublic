const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const sessionsCotroller = require('../controllers/sessionsController');

router
  .route('/')
  .get(verifyRoles(ROLES_LIST.User), sessionsCotroller.fetchAllSessions);

router
  .route('/create-session')
  .post(verifyRoles(ROLES_LIST.User), sessionsCotroller.createNewSession);

router
  .route('/:sessionId')
  .get(verifyRoles(ROLES_LIST.User), sessionsCotroller.fetchSession)
  .put(verifyRoles(ROLES_LIST.User), sessionsCotroller.updateSession);

module.exports = router;
