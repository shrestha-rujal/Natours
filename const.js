const TOURS_API = '/api/v1/tours';

const USERS_API = '/api/v1/users';

const TOURS_SIMPLE_PATH = `${__dirname}/dev-data/data/tours-simple.json`;

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
  TOURS_SIMPLE_PATH,
};
