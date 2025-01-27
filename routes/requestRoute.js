const express = require("express");
const router = express.Router();

const {
  postRequest,
  printRequest
} = require("../controllers/requestController");

router.post('/post_request', postRequest)

router.get('/print-requests', printRequest);


module.exports = router;