const express = require('express');
const morgan = require('morgan');
const {
  TOURS_API,
  USERS_API,
} = require('./const');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(TOURS_API, tourRouter);
app.use(USERS_API, userRouter);

module.exports = app;
