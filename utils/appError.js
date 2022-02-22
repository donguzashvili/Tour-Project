class appError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //this shows in what line error appears
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = appError;
