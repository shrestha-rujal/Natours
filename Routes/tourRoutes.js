const express = require('express');
const tourController = require('../Controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkId);

router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addTour);

router.route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour);

module.exports = router;
