const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour requires a name!'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration!'],
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'Tour requires a max group size!'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Tour requires a price!'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'Tour requires a summary'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty!'],
  },
  imageCover: {
    type: String,
    required: [true, 'Tour requires a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

tourSchema.virtual('durationWeeks').get(function getDurationWeeks() {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
