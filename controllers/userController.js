const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  let tempObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) tempObj[key] = obj[key];
  });
  return tempObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user POST password data
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This route is not for password updates!, please use /updatePassword',
        400
      )
    );
  //2) filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success' });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};
