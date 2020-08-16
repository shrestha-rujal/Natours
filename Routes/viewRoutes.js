const express = require('express');

const router = express.Router();
const viewController = require('../Controllers/viewController');


router.get('/tour/:slug', viewController.getTour);
router.get('/', viewController.getOverview);


module.exports = router;
