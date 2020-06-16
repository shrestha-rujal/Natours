const express = require('express');
const userController = require('../Controllers/usercontroller');
const authController = require('../Controllers/authController');

const router = express.Router();

router.param('id', userController.checkId);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
