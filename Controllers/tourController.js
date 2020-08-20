const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
// const QueryFilters = require('../utils/QueryFilters');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) return cb(null, true);
  return cb(new AppError('Not an image! Please upload image file(s)!', 400), false);
};

const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

exports.uploadTourImages = uploadPhoto.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = captureAsyncError(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  if (req.files.images.length !== 3) return next(new AppError('Tour must have 3 images!', 400));

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];
  await Promise.all(req.files.images.map(async (file, index) => {
    const imageName = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
    req.body.images.push(imageName);
    return sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${imageName}`);
  }));

  return next();
});

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
