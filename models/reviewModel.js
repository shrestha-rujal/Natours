const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

reviewSchema.statics.calcAverageRatings = async function useAggregate(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length ? stats[0].nRating : 0,
    ratingsAverage: stats.length ? stats[0].avgRating : 4.5,
  });
};

reviewSchema.pre(/^findOneAnd/, async function queryCurrentReview(next) {
  this.currentReview = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function updateRating() {
  await this.currentReview.constructor.calcAverageRatings(this.currentReview.tour);
});

reviewSchema.post('save', function callCalcAvgRatings() {
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

