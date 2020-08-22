const express = require('express');
const tourController = require('../Controllers/tourController');
const authController = require('../Controllers/authController');
const reviewRouter = require('./reviewRoutes');

const { ROLES } = require('../const');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/trending').get(tourController.aliasTrending, tourController.getAllTours);
router.route('/stats').get(tourController.tourStats);
router.route('/monthly-plan/:year').get(
  authController.checkLoggedIn,
  authController.restrictTo(ROLES.ADMIN, ROLES.LEAD_GUIDE, ROLES.GUIDE),
  tourController.tourMonthlyPlan,
);

router.route('/tours-near-location/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursNearLocation);

router.route('/tour-distances/:latlng/unit/:unit').get(tourController.getTourDistances);

router.route('/')
  .get(tourController.getAllTours)
  .post(
    authController.checkLoggedIn,
    authController.restrictTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.createTour,
  );

router.route('/:id')
  .get(tourController.getSingleTour)
  .patch(
    authController.checkLoggedIn,
    authController.restrictTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.editTour,
  )
  .delete(
    authController.checkLoggedIn,
    authController.restrictTo(ROLES.ADMIN, ROLES.LEAD_GUIDE),
    tourController.deleteTour,
  );

module.exports = router;
