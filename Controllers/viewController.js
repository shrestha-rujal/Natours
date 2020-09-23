const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
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

exports.getBookedTours = captureAsyncError(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', { title: 'Create new account' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'View your account' });
};

exports.updateUser = captureAsyncError(async (req, res) => {
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

exports.addReview = captureAsyncError(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug });

  if (!tour) {
    return next(new AppError("Can't add review to unknown tours!", 400));
  }

  res.locals.tour = tour;

  return res.status(200).render('add-review', { title: 'Add a review' });
});
