const Tour = require('../models/tourModel');
const captureAsyncError = require('../utils/CaptureAsyncError');

exports.getOverview = captureAsyncError(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
