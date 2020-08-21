const express = require('express');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

router.get(
  '/checkin-session/:tourId',
  authController.checkLoggedIn,
  bookingController.getCheckinSession,
);

module.exports = router;
