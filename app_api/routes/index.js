const express = require('express');
const router = express.Router();

//const tripsController = require('../controllers/trips');
const tripsController = require('../controllers/trips');

router 
    .route("/trips").get(tripsController.tripsList)
    .get(tripsController.tripsFindCode)

// router
//     .route('/')
//     .get(tripsController.tripsList)

module.exports = router;