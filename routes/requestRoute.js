const express = require("express");
const router = express.Router();

const {
  postRequest
} = require("../controllers/requestController");

router.post('/post_request', postRequest)

module.exports = router;