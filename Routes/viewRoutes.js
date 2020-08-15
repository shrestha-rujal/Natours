const express = require('express');

const router = express.Router();
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');

router.get('/', authController.isUserOnline, viewController.getOverview);
router.get('/tour/:slug', authController.isUserOnline, viewController.getTour);
router.get('/login', authController.isUserOnline, viewController.getLoginForm);
router.get('/account', authController.checkLoggedIn, viewController.getAccount);

module.exports = router;
