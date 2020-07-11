const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');

exports.deleteOne = (Model) => captureAsyncError(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) return next(new AppError('No document found with given ID', 404));

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
