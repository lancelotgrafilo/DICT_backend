const express = require("express");
const router = express.Router();

const {
  postRequest,
  printRequest,
  getRequest
} = require("../controllers/requestController");

router.post('/post-request', postRequest);

router.get('/print-requests', printRequest);

router.get('/get-requests', getRequest);


module.exports = router;