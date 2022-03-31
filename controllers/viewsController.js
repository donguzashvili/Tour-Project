const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
exports.getOverView = catchAsync(async (req, res, next) => {
  //1) get tour data from collection
  const tours = await Tour.find();
  //2) render that template using tour data from 1)
  res.status(200).render('overview', {
    tour: 'The Forest Hiker',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1)get data, for the requested tour(include reviews and guides)
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  //2)render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
