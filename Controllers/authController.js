/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const captureAsyncError = require('../utils/CaptureAsyncError');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET_KEY,
  { expiresIn: process.env.JWT_EXPIRES_IN },
);

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signup = captureAsyncError(async (req, res) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
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

  return createSendToken(user, 200, res);
});

exports.checkLoggedIn = captureAsyncError(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }
  if (!token) {
    return next(new AppError('Please login to perform this action!', 401));
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

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You are not permitted to perform this action!', 403));
  }
  return next();
};

exports.forgotPassword = captureAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('Email does not belong to any user!', 403));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Send new password and confirmation to:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next('Error sending email, Please try again later!', 500);
  }
});

exports.resetPassword = captureAsyncError(async (req, res, next) => {
  const hashedResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid or Expired Token', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  await user.save();

  return createSendToken(user, 200, res);
});

exports.updatePassword = captureAsyncError(async (req, res, next) => {
  const {
    currentPassword,
    password,
    passwordConfirm,
  } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.verifyPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect current password!', 401));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  return createSendToken(user, 200, res);
});
