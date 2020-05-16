const express = require('express');
const tourController = require('../Controllers/tourController');

const router = express.Router();

router.route('/trending').get(tourController.aliasTrending, tourController.getAllTours);
router.route('/stats').get(tourController.tourStats);
router.route('/monthly-plan/:year').get(tourController.tourMonthlyPlan);

router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour);

module.exports = router;
