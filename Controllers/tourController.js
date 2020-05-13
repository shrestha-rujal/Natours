const fs = require('fs');
const { TOURS_SIMPLE_PATH } = require('./../const');
const tours = JSON.parse(fs.readFileSync(TOURS_SIMPLE_PATH));

exports.checkId = (req, res, next, value) => {
  if (value > tours[tours.length - 1].id) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if (!req.body['name'] || !req.body['duration'] ) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data.',
    });
  }
  next();
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    }
  });
};

exports.getSingleTour = (req, res) => {
  const tourId = Number(req.params.id);
  const reqTour = tours.find(tour => tour.id === tourId);

  res.status(200).json({
    status: 'success',
    data: {
      tour: reqTour,
    }
  });
};

exports.addTour = (req, res) => {
  const newTourId = tours[tours.length -1 ].id + 1;
  const newTourObject = { id: newTourId, ...req.body }
  tours.push(newTourObject);
  fs.writeFile(TOURS_SIMPLE_PATH, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTourObject,
      }
    });
  });
};

exports.editTour = (req, res) => {
  const tourId = Number(req.params.id);
  const reqTour = tours.find(tour => tour.id === tourId);

  res.status(200).json({
    status: 'success',
    data: {
      ...reqTour,
      ...req.body,
    }
  });
};

exports.deleteTour = (req, res) => {
  const tourId = Number(req.params.id);
  const reqTour = tours.find(tour => tour.id === tourId);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tours.filter(tour => tour.id !== tourId),
    }
  });
};
