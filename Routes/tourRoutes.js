const express = require('express');
const tourController = require('../Controllers/tourController');

const router = express.Router();

router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour);

module.exports = router;
