const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Cannot have an empty review'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour.'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

reviewSchema.pre(/^find/, function populateUserAndTour(next) {
  this
    .populate({
      path: 'user',
      select: 'name photo',
    // })
    // .populate({
    //   path: 'tour',
    //   select: 'name',
    });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
