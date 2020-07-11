const Review = require('../models/reviewModel');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

exports.getAllReviews = captureAsyncError(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  return res.status(200).json({
    status: 'success',
    records: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = captureAsyncError(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getSingleReview = captureAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) next(new AppError('Unable to find review related to given id!', 404));

  return res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.editReview = captureAsyncError(async (req, res, next) => {
  const editedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!editedReview) return next(new AppError('Unable to edit review with give id!', 404));

  return res.status(200).json({
    status: 'success',
    data: { review: editedReview },
  });
});

exports.deleteReview = factory.deleteOne(Review);
