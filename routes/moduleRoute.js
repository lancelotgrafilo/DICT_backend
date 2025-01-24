const express = require("express");
const router = express.Router();

const {
  postModule
} = require('../controllers/moduleController');

router.use('/post_module', postModule)

module.exports = router;