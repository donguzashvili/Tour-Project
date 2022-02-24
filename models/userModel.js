const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: [true, 'this email already exists!'],
    lowercase: true, //converts to lowercase
    validate: [validator.isEmail, 'Please enter correct email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please repeat your password'],
    validate: {
      //this only works on create and save!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same!',
    },
    select: false,
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //only run this function is password was actually modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete password confirm field
  this.confirmPassword = undefined;

  next();
});

//creating new function for userSchema which compares user database password with login password and returns boolean
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  //false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
