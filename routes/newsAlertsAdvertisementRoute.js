const express = require("express");
const router = express.Router();

const {
  postNewsAlertAdvertisement
} = require('../controllers/newsAlertsAdvertisementController');

router.post('/post-news-alerts-advertisement', postNewsAlertAdvertisement);

module.exports = router;