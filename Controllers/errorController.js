/* eslint-disable */
const AppError = require('../utils/AppError');

const CAST_ERROR = 'CastError';
const VALIDATION_ERROR = 'ValidationError';
const DUPLICATE_ERROR_CODE = 11000;
const JWT_WEBTOKEN_ERROR = 'JsonWebTokenError';
const JWT_TOKENEXPIRED_ERROR = 'TokenExpiredError';

const handleCastErrorDB = (error) => new AppError(
  `Invalid input for ${error.path}: ${error.value}`,
  400,
);

const handleDuplicateFieldErrorDB = (error) => new AppError(
  `Duplicate ${Object.keys(error.keyValue)[0]}: ${error.keyValue.name}`,
  400,
);

const handleValdationErrorsDB = (error) => {
  const formattedErrors = Object.values(error.errors).map((err) => err.message).join(' ');
  return new AppError(formattedErrors, 400);
};

const handleInvalidTokenError = () => new AppError(
  'Invalid authentication token!',
  401,
);

const handleTokenExpiredError = () => new AppError('Session expired! Please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    errorMsg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      errorMsg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    errorMsg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === CAST_ERROR) error = handleCastErrorDB(error);
    if (error.code === DUPLICATE_ERROR_CODE) error = handleDuplicateFieldErrorDB(error);
    if (error.name === VALIDATION_ERROR) error = handleValdationErrorsDB(error);
    if (error.name === JWT_WEBTOKEN_ERROR) error = handleInvalidTokenError();
    if (error.name === JWT_TOKENEXPIRED_ERROR) error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};
