/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const captureAsyncError = require('../utils/CaptureAsyncError');

exports.signup = captureAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});
