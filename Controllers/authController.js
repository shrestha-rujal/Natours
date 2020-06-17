/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

exports.signup = captureAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  return res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});

exports.login = captureAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = signToken(user._id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});

exports.checkLoggedIn = captureAsyncError(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }
  if (!token) {
    return next(new AppError('Please Login to view tours!', 401));
  }

  const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  const validUser = await User.findById(decodedPayload.id);

  if (!validUser) {
    return next(new AppError('The user belonging to this token no longer exists!', 401));
  }

  if (validUser.hasPasswordChanged(decodedPayload.iat)) {
    return next(new AppError('Account password has changed, Please login again!', 401));
  }

  req.user = validUser;

  return next();
});
