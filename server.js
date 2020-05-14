const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB_URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const PORT = 3000;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('DATABASE CONNECTION SUCCESSFUL'))
  .catch((err) => console.error('Database connection failed: ', err));

app.listen(process.env.PORT || PORT, () => {
  console.log(`SERVER LISTENING AT ${PORT}`);
});
