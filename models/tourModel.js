const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour requires a name!'],
    unique: true,
    trim: true,
    maxlength: [40, 'Tour name cannot exceed 40 characters.'],
    minlength: [4, 'Tour name should be atlease 4 characters long.'],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration!'],
    min: [3, 'Tour duration too short.'],
    max: [31, 'Tour duration too long.'],
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
  priceDiscount: {
    type: Number,
    validate: {
      validator(val) {
        return val < this.price;
      },
      message: 'Discount ({VALUE}) cannot be greater than tour price!',
    },
  },
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
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty can be easy, medium or difficult',
    },
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
  secret: {
    type: Boolean,
    default: false,
  },
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    description: String,
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
  guides: Array,
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

tourSchema.virtual('durationWeeks').get(function getDurationWeeks() {
  return this.duration / 7;
});

tourSchema.pre('save', function createSlug(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', async function fetchGuides(next) {
  const guidesPromises = this.guides.map(async (guideIds) => User.findById(guideIds));
  this.guides = await Promise.all(guidesPromises);
  next();
});

tourSchema.pre(/^find/, function hideSecretTours(next) {
  this.find({ secret: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function hideSecretToursAgg(next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
