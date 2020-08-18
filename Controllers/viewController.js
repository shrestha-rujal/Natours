const Tour = require('../models/tourModel');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');

exports.getOverview = captureAsyncError(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = captureAsyncError(async (req, res, next) => {
  const tour = await Tour
    .findOne({ slug: req.params.slug })
    .populate({ path: 'reviews', field: 'review rating user' });

  if (!tour) return next(new AppError('Unable to find any tour with that name!', 404));

  return res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};
