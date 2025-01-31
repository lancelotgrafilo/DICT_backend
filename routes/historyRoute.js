const express = require("express");
const router = express.Router();

const { postHistory, getHistory } = require('../controllers/historyController');

// Route to add a new transaction history
router.post('/post-history', postHistory);

// Route to fetch all transaction history
router.get('/get-history', getHistory);

module.exports = router;
