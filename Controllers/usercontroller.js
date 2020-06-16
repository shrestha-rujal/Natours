const User = require('../models/userModel');
const captureAsyncError = require('../utils/CaptureAsyncError');

exports.checkId = (req, res, next, value) => {
  console.log('check user id: ', value);
  next();
};

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
