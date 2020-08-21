const express = require('express');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.checkLoggedIn,
  bookingController.getCheckoutSession,
);

module.exports = router;
