const express = require('express');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');
const { ROLES } = require('../const');

const router = express.Router();

router.use(authController.checkLoggedIn);

router.get(
  '/checkout-session/:tourId',
  bookingController.getCheckoutSession,
);

router.use(authController.restrictTo(ROLES.ADMIN, ROLES.LEAD_GUIDE));

router.route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
