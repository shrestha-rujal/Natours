const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
const UNHANDLED_REJECTION = 'unhandledRejection';
const PORT = 3000;

console.log('NODE ENVIRONMENT: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'aws') {
  const DB_URI = process.env.AWS_DATABASE.replace('<PASSWORD>', process.env.AWS_PASSWORD);
  const CA = [fs.readFileSync("rds-combined-ca-bundle.pem")];
  
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    sslValidate: true,
    sslCA: CA, 
  })
    .then(() => console.log('AWS DB CONNECTION SUCCESSFUL'))
    .catch((error) => console.log('AWS ERROR: ', error));

} else {
  const DB_URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
  
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
    .then(() => console.log('DATABASE CONNECTION SUCCESSFUL'));
}

const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`SERVER LISTENING AT ${PORT}`);
});

process.on(UNHANDLED_REJECTION, (err) => {
  server.close(() => {
    console.error(err.name, err.message);
    process.exit(1);
  });
});
