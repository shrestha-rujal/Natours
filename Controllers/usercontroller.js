const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const captureAsyncError = require('../utils/CaptureAsyncError');
const factory = require('./handlerFactory');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) return cb(null, true);
  return cb(new AppError('Not an image! Please upload image file type!', 400), false);
};

const photoUpload = multer({
  storage: multer.memoryStorage(),
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

exports.resizeUploadPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  return next();
};

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
  if (req.file) filteredBody.photo = req.file.filename;

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
