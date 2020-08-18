const express = require('express');

const router = express.Router();
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');

router.use(authController.isUserOnline);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
