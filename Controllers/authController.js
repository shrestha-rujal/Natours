const User = require('../models/userModel');
const captureAsyncError = require('../utils/CaptureAsyncError');

exports.signup = captureAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);

  return res.status(201).json({
    status: 'success',
    user: newUser,
  });
});
