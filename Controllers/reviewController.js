const Review = require('../models/reviewModel');
const QueryFilters = require('../utils/QueryFilters');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');

exports.getAllReviews = captureAsyncError(async (req, res) => {
  const filteredQuery = new QueryFilters(Review.find(), req.query)
    .filter()
    .selectFields()
    .sort()
    .paginate();
  const reviews = await filteredQuery.query;
  return res.status(200).json({
    status: 'success',
    records: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = captureAsyncError(async (req, res) => {
  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getSingleReview = captureAsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) next(new AppError('Unable to find review related to given id!', 404));

  return res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.editReview = captureAsyncError(async (req, res, next) => {
  const editedReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!editedReview) return next(new AppError('Unable to edit review with give id!', 404));

  return res.status(200).json({
    status: 'success',
    data: { review: editedReview },
  });
});

exports.deleteReview = captureAsyncError(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.reviewId);

  if (!review) return next(new AppError('Unable to delete review with given id', 404));

  return res.status(200).json({
    status: 'success',
    data: null,
  });
});
