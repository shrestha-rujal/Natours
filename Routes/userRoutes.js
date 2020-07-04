const express = require('express');
const userController = require('../Controllers/usercontroller');
const authController = require('../Controllers/authController');

const router = express.Router();

router.param('id', userController.checkId);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateUser',
  authController.checkLoggedIn,
  userController.updateCurrentUserData);
router.patch('/updatePassword',
  authController.checkLoggedIn,
  authController.updateCurrentUserPassword);

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
