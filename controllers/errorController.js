const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const duplicateValue = err.keyValue.name;
  const message = `Duplicate field value: "${duplicateValue}" please use another value`;
  return new AppError(message, 400);
};

const handleValidationDB = (err) => {
  const errors = err.errors;
  let tempString = '';
  for (const key in errors) {
    tempString += `${key}: ${errors[key].message}. `;
  }
  return new AppError(tempString, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. please log in again!', 401);

const expiredJWTError = () =>
  new AppError('Token expired. please log in again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  //operational, truested error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //programming or other unknow error: dont leak error details
  } else {
    //1) log error
    console.error('ERROR', err);
    //2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = expiredJWTError();
    sendErrorProd(err, res);
  }
};
