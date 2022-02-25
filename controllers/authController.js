const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const AppError = require('../utils/appError');
const email = require('../utils/email');

const signToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt
      ? req.body.passwordChangedAt
      : null,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exists
  if (!email || !password)
    return next(new AppError('Please enter email and password!', 400));
  //2)check if user exists && password is correct;
  //+password means select field which is not shown in database(password is hidden "select: false")
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password!', 401));
  //3) if everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) getting token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  //2) verification token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  //3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging this token does no longer exists!', 401)
    );
  //4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please log in again.', 401)
    );
  }

  //grant access to protected route
  req.user = currentUser;
  next();
});

//gets all roles in array, roles = ["admin", "lead-guide"]
exports.restrictTo = (...role) => {
  return (req, res, next) => {
    // i'm saving user object(req.user) in login line 85
    if (!role.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with email address.', 404));
  //2) generate random reset tokens
  const resetToken = user.createPasswordResetToken();

  await user.save();
  //this will turn off every validation before save
  //   await user.save({ validateBeforeSave: false });
  //3) send it to user mail
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword:${resetToken}`;

  console.log(resetURL);
  const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${resetURL}.\nif you didnt forget your password, please ignore this email!`;

  try {
    await email({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new AppError('ther ewas an error sending the email. try again later!'),
      500
    );
  }
});

exports.resetPassword = (req, res, next) => {};
