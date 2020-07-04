const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const captureAsyncError = require('../utils/CaptureAsyncError');

const filterBody = (body, editableFields) => {
  const newBodyObj = {};
  Object.keys(body).forEach((field) => {
    if (editableFields.includes(field)) newBodyObj[field] = body[field];
  });
  return newBodyObj;
};

exports.checkId = (req, res, next, value) => {
  console.log('check user id: ', value);
  next();
};

exports.updateCurrentUserData = captureAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Cannot update password, please use dedicated password route!', 400));
  }

  const editableFields = ['name', 'email'];
  const filteredBody = filterBody(req.body, editableFields);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = captureAsyncError(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
};

exports.editUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
};
