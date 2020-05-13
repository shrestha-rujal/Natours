exports.checkId = (req, res, next, value) => {
  console.log('check user id: ', value);
  next();
}

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
}

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
}

exports.editUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route undefined Yet!',
  });
}
