const Tour = require('../models/tourModel');
// const QueryFilters = require('../utils/QueryFilters');
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

exports.getToursNearLocation = captureAsyncError(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [latitude, longitude] = latlng.split(',');

  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  if (!latitude || !longitude) {
    return next(new AppError('Invalid co-ordinates for location center!', 400));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } },
  });

  return res.status(200).json({
    status: 'success',
    data: {
      records: tours.length,
      data: tours,
    },
  });
});

exports.getTourDistances = captureAsyncError(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [latitude, longitude] = latlng.split(',');

  if (!latitude || !longitude) {
    return next(new AppError('Invalid co-ordinates for location center', 400));
  }

  const distanceMultiplier = unit === 'km' ? 0.001 : 0.000621371;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1],
        },
        distanceField: 'distance',
        distanceMultiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    data: {
      records: distances.length,
      data: distances,
    },
  });

});

exports.getAllTours = factory.getAll(Tour);
exports.getSingleTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.editTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
