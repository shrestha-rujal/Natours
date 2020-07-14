const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');
const QueryFilters = require('../utils/QueryFilters');

exports.createOne = (Model) => captureAsyncError(async (req, res) => {
  const doc = await Model.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getOne = (Model, populateOptions) => captureAsyncError(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (populateOptions) query = query.populate(populateOptions);
  const doc = await query;

  if (!doc) return next(new AppError('Unable to find any document with given id!', 404));

  return res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getAll = (Model) => captureAsyncError(async (req, res) => {

  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const filteredQuery = new QueryFilters(Model.find(filter), req.query)
    .filter()
    .selectFields()
    .sort()
    .paginate();
  const docs = await filteredQuery.query;

  return res.status(200).json({
    status: 'success',
    records: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.updateOne = (Model) => captureAsyncError(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new AppError('Unable to find any document with given id!', 404));

  return res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});


exports.deleteOne = (Model) => captureAsyncError(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) return next(new AppError('No document found with given ID', 404));

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
