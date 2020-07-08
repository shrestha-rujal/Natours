const express = require('express');
const authController = require('../Controllers/authController');
const reviewController = require('../Controllers/reviewController');
const { ROLES } = require('../const');

const router = express.Router();

router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.checkLoggedIn,
    authController.restrictTo(ROLES.USER),
    reviewController.createReview,
  );

router.route('/:reviewId')
  .get(reviewController.getSingleReview)
  .patch(authController.checkLoggedIn, reviewController.editReview)
  .delete(authController.checkLoggedIn, reviewController.deleteReview);

module.exports = router;
