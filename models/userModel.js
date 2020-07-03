const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { ROLES } = require('../const');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation required'],
    validate: {
      validator: function passwordValidator(el) {
        return this.password === el;
      },
      message: 'Password confirmation failed!',
    },
  },
  role: {
    type: String,
    enum: [...Object.values(ROLES)],
    default: ROLES.USER,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
});

userSchema.pre('save', async function encryptPassword(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  return next();
});

userSchema.methods.verifyPassword = async function verifyPassword(candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasPasswordChanged = function hasPasswordChanged(tokenTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenTimestamp < passwordChangeTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
