const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1) MiddleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

//3) Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new appError(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'error';
  // err.statusCode = 404;

  //to make global error handler work you must pass variable to next()
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//error handling middleware (4 parameters is must)
app.use(globalErrorHandler);

module.exports = app;
