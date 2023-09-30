const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router
  .route('/')
  .get(verifyRoles(ROLES_LIST.User), exerciseController.fetchAllExercises)
  .post(verifyRoles(ROLES_LIST.User), exerciseController.addExercise);

router.route('/test').post(exerciseController.test);

module.exports = router;
