const express = require('express');
const authController = require('../Controllers/authController');
const reviewController = require('../Controllers/reviewController');
const { ROLES } = require('../const');

const router = express.Router({ mergeParams: true });

router.use(authController.checkLoggedIn);

router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo(ROLES.USER),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router.route('/:id')
  .get(reviewController.getSingleReview)
  .patch(authController.restrictTo(ROLES.USER, ROLES.ADMIN), reviewController.editReview)
  .delete(authController.restrictTo(ROLES.USER, ROLES.ADMIN), reviewController.deleteReview);

module.exports = router;
