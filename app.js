const express = require('express');
const fs = require('fs');

const {
  TOURS_API,
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

app.post(TOURS_API, (req, res) => {
  const newTourId = tours[tours.length -1 ].id + 1;
  const newTourObject = { id: newTourId, ...req.body }
  tours.push(newTourObject);
  console.log('new tours: ', tours);
  fs.writeFile(TOURS_SIMPLE_PATH, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTourObject,
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`SERVER LISTENING AT ${PORT}`);
});
