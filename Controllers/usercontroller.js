const multer = require('multer');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const captureAsyncError = require('../utils/CaptureAsyncError');
const factory = require('./handlerFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/img/users'),
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) return cb(null, true);
  return cb(new AppError('Please upload image file type!', 400), false);
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterBody = (body, editableFields) => {
  const newBodyObj = {};
  Object.keys(body).forEach((field) => {
    if (editableFields.includes(field)) newBodyObj[field] = body[field];
  });
  return newBodyObj;
};

exports.uploadUserPhoto = photoUpload.single('photo');

exports.checkId = (req, res, next, value) => {
  console.log('check user id: ', value);
  next();
};

exports.setCurrentUserId = (req, res, next) => {
  req.params.id = req.user.id;
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

exports.deleteCurrentUser = captureAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.editUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
