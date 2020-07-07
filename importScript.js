const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const Review = require('./models/reviewModel');
const User = require('./models/userModel');
const { TOURS_PATH, REVIEWS_PATH, USERS_PATH } = require('./const');

dotenv.config({ path: './config.env' });

const URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('DATABASE CONNECTION ESTABLISHED'))
  .catch((err) => console.log('ERROR CONNECTING TO DB: ', err));

const tours = JSON.parse(fs.readFileSync(TOURS_PATH, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(REVIEWS_PATH, 'utf-8'));
const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));

const importResources = async () => {
  try {
    await Promise.all([
      Tour.create(tours),
      Review.create(reviews),
      User.create(users, { validateBeforeSave: false }),
    ]);
    console.log('IMPORT SUCCESSFULL!');
  } catch (err) {
    console.log('ERROR IMPORTING! ', err);
  }
};

const deleteResources = async () => {
  try {
    await Promise.all([
      Tour.deleteMany(),
      Review.deleteMany(),
      User.deleteMany(),
    ]);
    console.log('DELETED ALL DATA!');
  } catch (err) {
    console.log('ERROR DELETING! ', err);
  }
};

(async function runScript() {
  if (process.argv.includes('--delete')) {
    await deleteResources();
  }
  if (process.argv.includes('--import')) {
    await importResources();
  }
  process.exit(); //eslint-disable-line
}());
