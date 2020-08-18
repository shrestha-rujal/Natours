const Tour = require('../models/tourModel');
const captureAsyncError = require('../utils/CaptureAsyncError');

exports.getOverview = captureAsyncError(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = captureAsyncError(async (req, res) => {
  const tour = await Tour
    .findOne({ slug: req.params.slug })
    .populate({ path: 'reviews', field: 'review rating user' });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};
