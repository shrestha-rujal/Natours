const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB_URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const UNHANDLED_REJECTION = 'unhandledRejection';
const PORT = 3000;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('DATABASE CONNECTION SUCCESSFUL'));

const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`SERVER LISTENING AT ${PORT}`);
});

process.on(UNHANDLED_REJECTION, (err) => {
  server.close(() => {
    console.error(err.name, err.message);
    process.exit(1);
  });
});
