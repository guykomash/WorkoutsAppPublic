const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router
  .route('/users/get-users')
  .get(verifyRoles(ROLES_LIST.Admin), usersController.fetchAllUsers);

router
  .route('/users/:userId')
  .get(verifyRoles(ROLES_LIST.Admin), usersController.fetchUserById)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUserById);

router.put(
  '/users/update-roles-:userId',
  verifyRoles(ROLES_LIST.Admin),
  usersController.updateRolesById
);

module.exports = router;
