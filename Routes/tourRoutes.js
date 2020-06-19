const express = require('express');
const tourController = require('../Controllers/tourController');
const authController = require('../Controllers/authController');
const { ROLES } = require('../const');

const router = express.Router();

router.route('/trending').get(tourController.aliasTrending, tourController.getAllTours);
router.route('/stats').get(tourController.tourStats);
router.route('/monthly-plan/:year').get(tourController.tourMonthlyPlan);

router.route('/')
  .get(authController.checkLoggedIn, tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.editTour)
  .delete(
    authController.checkLoggedIn,
    authController.restrictTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.deleteTour,
  );

module.exports = router;
