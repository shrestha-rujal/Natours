const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation required'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
