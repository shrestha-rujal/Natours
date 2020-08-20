const express = require('express');
const userController = require('../Controllers/usercontroller');
const authController = require('../Controllers/authController');

const { ROLES } = require('../const');

const router = express.Router();

router.param('id', userController.checkId);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.checkLoggedIn);

router.patch('/updateUser', userController.uploadUserPhoto, userController.updateCurrentUserData);
router.delete('/deleteUser', userController.deleteCurrentUser);
router.patch('/updatePassword', authController.updateCurrentUserPassword);

router.get(
  '/user-info',
  userController.setCurrentUserId,
  userController.getUser,
);

router.use(authController.restrictTo(ROLES.ADMIN));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
