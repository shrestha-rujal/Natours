const Tour = require('../models/tourModel');
const QueryFilters = require('../utils/QueryFilters');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

exports.aliasTrending = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-ratingsQuantity,price';
  req.query.fields = 'name,ratingsAverage,ratingsQuantity,summary,description';
  next();
};

exports.tourStats = captureAsyncError(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { numTours: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    stats,
  });
});

exports.tourMonthlyPlan = captureAsyncError(async (req, res) => {
  const year = Number(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-00-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    records: plan.length,
    plan,
  });
});

exports.getAllTours = captureAsyncError(async (req, res) => {
  const filteredQuery = new QueryFilters(Tour.find(), req.query)
    .filter()
    .selectFields()
    .sort()
    .paginate();
  const tours = await filteredQuery.query;
  res.status(200).json({
    status: 'success',
    records: tours.length,
    tours,
  });
});

exports.getSingleTour = captureAsyncError(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError("Couldn't find any tour with given id", 404));
  }

  return res.status(200).json({
    status: 'success',
    tour,
  });
});

exports.createTour = captureAsyncError(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.editTour = captureAsyncError(async (req, res, next) => {
  const editedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!editedTour) {
    return next(new AppError('Unable to find a tour with given id', 404));
  }

  return res.status(200).json({
    status: 'success',
    tour: editedTour,
  });
});

exports.deleteTour = factory.deleteOne(Tour);
