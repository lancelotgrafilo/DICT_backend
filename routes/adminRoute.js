const express = require("express");
const router = express.Router();

const {
  postAdmin
} = require('../controllers/adminController');

router.post("/post-admin", postAdmin);

module.exports = router;