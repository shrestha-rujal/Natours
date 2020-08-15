const express = require('express');

const router = express.Router();
const viewController = require('../Controllers/viewController');


router.get('/', viewController.getOverview);
router.get('/tour', viewController.getTour);


module.exports = router;
