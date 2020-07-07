const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const { TOURS_PATH } = require('./const');

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

const importTours = async () => {
  let createTour;
  try {
    createTour = await Tour.create(tours);
    console.log('TOURS SUCCESSFULLY IMPORTED!');
  } catch (err) {
    console.log('ERROR IMPORTING TOURS! ', err);
  }
  return createTour;
};

const deleteTours = async () => {
  let deleteTour;
  try {
    deleteTour = await Tour.deleteMany();
    console.log('DELETED ALL TOURS!');
  } catch (err) {
    console.log('ERROR DELETING TOURS! ', err);
  }
  return deleteTour;
};

(async function runScript() {
  if (process.argv.includes('--delete')) {
    await deleteTours();
  }
  if (process.argv.includes('--import')) {
    await importTours();
  }
  process.exit(); //eslint-disable-line
}());
