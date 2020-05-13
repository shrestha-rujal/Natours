const express = require('express');
const userController = require('../Controllers/usercontroller');

const router = express.Router();

router.param('id', userController.checkId);

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
