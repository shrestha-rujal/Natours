const express = require('express');
const fs = require('fs');

const {
  TOURS_API,
  TOUR_API,
  TOURS_SIMPLE_PATH,
} = require('./const');

const app = express();
const PORT = 3000;

const tours = JSON.parse(fs.readFileSync(TOURS_SIMPLE_PATH));

app.use(express.json());

app.get(TOURS_API, (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    }
  });
});

app.get(TOUR_API, (req, res) => {
  const tourId = Number(req.params.id);
  const reqTour = tours.find(tour => tour.id === tourId);

  if (!reqTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Unable to find tour with given Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: reqTour,
    }
  });
});

app.post(TOURS_API, (req, res) => {
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
});

app.patch(TOUR_API, (req, res) => {
  const tourId = Number(req.params.id);
  const reqTour = tours.find(tour => tour.id === tourId);

  if (!reqTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      ...reqTour,
      ...req.body,
    }
  });
});

app.delete(TOUR_API, (req, res) => {
  const tourId = Number(req.params.id);
  const reqTour = tours.find(tour => tour.id === tourId);

  if (!reqTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tours.filter(tour => tour.id !== tourId),
    }
  });
});

app.listen(PORT, () => {
  console.log(`SERVER LISTENING AT ${PORT}`);
});
