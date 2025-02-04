// routes/fileRoutes.js
const express = require('express');
const router = express.Router();

const {
  getFiles
} = require('../controllers/fileController');

router.get('/files', getFiles);

module.exports = router;
