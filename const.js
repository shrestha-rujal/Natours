const TOURS_API = '/api/v1/tours';
const USERS_API = '/api/v1/users';
const REVIEWS_API = '/api/v1/reviews';

const TOURS_SIMPLE_PATH = `${__dirname}/dev-data/data/tours-simple.json`;
const TOURS_PATH = `${__dirname}/dev-data/data/tours.json`;
const REVIEWS_PATH = `${__dirname}/dev-data/data/reviews.json`;
const USERS_PATH = `${__dirname}/dev-data/data/users.json`;

const ROLES = {
  ADMIN: 'admin',
  GUIDE: 'guide',
  LEAD_GUIDE: 'lead guide',
  USER: 'user',
};

module.exports = {
  ROLES,
  TOURS_API,
  USERS_API,
  REVIEWS_API,
  TOURS_SIMPLE_PATH,
  TOURS_PATH,
  REVIEWS_PATH,
  USERS_PATH,
};
