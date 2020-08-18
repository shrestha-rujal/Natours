const Tour = require('../models/tourModel');
const User = require('../models/userModel');
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

exports.getAccount = (req, res) => {
  return res.status(200).render('account', { title: 'View your account' });
};

exports.updateUser = captureAsyncError(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    }, {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'View your account',
    user: updatedUser,
  });
});
